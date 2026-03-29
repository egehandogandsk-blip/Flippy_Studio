import { useDocumentStore } from '../store/documentStore';

const GRID_GAP = 50;
const MAX_ROW_WIDTH = 3000;
const START_X = 100;
const START_Y = 100;

export const calculateNextPosition = (width: number, _height: number): { x: number, y: number } => {
    const nodes = useDocumentStore.getState().nodes;
    const rootId = useDocumentStore.getState().rootId;

    // 1. Get all top-level nodes (children of root)
    const rootNode = nodes[rootId];
    if (!rootNode || !rootNode.children || rootNode.children.length === 0) {
        return { x: START_X, y: START_Y };
    }

    const topLevelNodes = rootNode.children
        .map(id => nodes[id])
        .filter(n => n && (n.type === 'FRAME' || n.type === 'GROUP')); // Only consider containers

    if (topLevelNodes.length === 0) {
        return { x: START_X, y: START_Y };
    }

    // 2. Sort nodes by Y then X to find the "last" one visually
    // Error logic: user might drag things around.
    // Better logic: Find the "bottom-most" row and append to it.

    // Let's sort simply by Y coordinate roughly (to group into rows)
    // We group nodes into "rows" based on their Y position overlaps

    // Simplified Logic:
    // Just find the node with the maximum (x + width) in the set of nodes that are roughly at the standard Y level?
    // No, that fails if we have multiple rows.

    // Robust Logic:
    // 1. Find all nodes.
    // 2. Identify the "Lowest" Y coordinate occupied (max Y + height).
    // 3. Identify the "Right-most" X coordinate in the "Current Last Row".

    // Let's rely on a simpler "Append Streak":
    // User wants a grid. We can just check the bounding box of ALL nodes?

    // Let's try this:
    // 1. Sort by Y (primary) and X (secondary).
    topLevelNodes.sort((a, b) => {
        const yDiff = a.y - b.y;
        if (Math.abs(yDiff) > 100) return yDiff; // Different rows
        return a.x - b.x; // Same row
    });

    const lastNode = topLevelNodes[topLevelNodes.length - 1];

    // Check if we can fit to the right of the last node
    const nextX = lastNode.x + lastNode.width + GRID_GAP;

    // Check if we exceed row width
    if (nextX + width > MAX_ROW_WIDTH) {
        // Move to next row
        // Find the max Height in the current row to determine Y
        // Current row nodes:
        const currentRowY = lastNode.y;
        const rowNodes = topLevelNodes.filter(n => Math.abs(n.y - currentRowY) < 100);
        const maxRowHeight = Math.max(...rowNodes.map(n => n.height));

        return { x: START_X, y: currentRowY + maxRowHeight + GRID_GAP };
    } else {
        // Stay on same row
        return { x: nextX, y: lastNode.y };
    }
};
