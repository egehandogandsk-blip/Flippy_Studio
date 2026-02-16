import { DocumentNode } from '../store/documentStore';

export interface AlignmentGuide {
    type: 'vertical' | 'horizontal';
    position: number;
    start: number;
    end: number;
    alignmentType: 'left' | 'right' | 'top' | 'bottom' | 'centerX' | 'centerY';
}

export interface DistanceMeasurement {
    type: 'horizontal' | 'vertical';
    distance: number;
    from: { x: number; y: number };
    to: { x: number; y: number };
}

export interface SmartGuidesResult {
    guides: AlignmentGuide[];
    measurements: DistanceMeasurement[];
    snapOffset: { x: number; y: number };
}

const SNAP_THRESHOLD = 5;

// Helper to get global position of a frame
const getGlobalPosition = (nodeId: string, nodes: Record<string, DocumentNode>): { x: number, y: number } => {
    let x = 0;
    let y = 0;
    let currentId: string | undefined = nodeId;

    while (currentId && currentId !== 'root' && nodes[currentId]) {
        const node: DocumentNode = nodes[currentId];
        x += node.x;
        y += node.y;
        currentId = node.parentId;
    }

    return { x, y };
};

export const calculateSmartGuides = (
    draggedNode: DocumentNode,
    draggedBounds: { x: number; y: number; width: number; height: number },
    allNodes: Record<string, DocumentNode>,
    draggedNodeId: string
): SmartGuidesResult => {
    const guides: AlignmentGuide[] = [];
    const measurements: DistanceMeasurement[] = [];
    let snapOffset = { x: 0, y: 0 };
    let minSnapDistX = Infinity;
    let minSnapDistY = Infinity;

    // Calculate Parent Global Offset for rendering
    let parentOffsetX = 0;
    let parentOffsetY = 0;

    // If dragged node has a parent, draggedBounds are local to that parent.
    // We need to convert them to global for rendering guides.
    if (draggedNode.parentId && draggedNode.parentId !== 'root') {
        const globalPos = getGlobalPosition(draggedNode.parentId, allNodes);
        parentOffsetX = globalPos.x;
        parentOffsetY = globalPos.y;
    }

    // draggedBounds are LOCAL. 
    // We use LOCAL bounds for snapping calculations (so the object snaps to its parent's grid/content).
    // We use GLOBAL bounds for rendering the visual guides.

    const localLeft = draggedBounds.x;
    const localRight = draggedBounds.x + draggedBounds.width;
    const localTop = draggedBounds.y;
    const localBottom = draggedBounds.y + draggedBounds.height;
    const localCenterX = draggedBounds.x + draggedBounds.width / 2;
    const localCenterY = draggedBounds.y + draggedBounds.height / 2;

    const globalLeft = localLeft + parentOffsetX;
    const globalRight = localRight + parentOffsetX;
    const globalTop = localTop + parentOffsetY;
    const globalBottom = localBottom + parentOffsetY;
    const globalCenterX = localCenterX + parentOffsetX;
    const globalCenterY = localCenterY + parentOffsetY;

    // Get comparison nodes
    const comparisonNodes = Object.entries(allNodes).filter(([id, node]) => {
        if (id === draggedNodeId) return false;

        // Skip invisible nodes (Critical for crash prevention if renderer expects visible nodes)
        if (node.visible === false) return false;

        const draggedParent = draggedNode.parentId || 'root';
        const nodeParent = node.parentId || 'root';

        // Only compare with siblings for now
        return draggedParent === nodeParent;
    });

    // 1. Check against Parent Bounds (if inside a frame)
    if (draggedNode.parentId && draggedNode.parentId !== 'root' && allNodes[draggedNode.parentId]) {
        const parent = allNodes[draggedNode.parentId];

        // Parent Edges (Local to Parent)
        const parentLeft = 0;
        const parentTop = 0;
        const parentRight = parent.width;
        const parentBottom = parent.height;
        const parentCenterX = parent.width / 2;
        const parentCenterY = parent.height / 2;

        const parentGlobalTop = parentOffsetY; // 0 + OffsetY
        const parentGlobalBottom = parent.height + parentOffsetY;

        // Vertical Checks (Snap Local X)
        const verticalChecks = [
            { dragPos: localLeft, targetPos: parentLeft, type: 'left' as const },
            { dragPos: localRight, targetPos: parentRight, type: 'right' as const },
            { dragPos: localCenterX, targetPos: parentCenterX, type: 'centerX' as const },
        ];

        verticalChecks.forEach(({ dragPos, targetPos, type }) => {
            const dist = Math.abs(dragPos - targetPos);
            if (dist <= SNAP_THRESHOLD) {
                const offset = targetPos - dragPos;
                if (Math.abs(offset) < Math.abs(minSnapDistX)) {
                    minSnapDistX = offset;
                    snapOffset.x = offset; // Offset is LOCAL
                }
                // Guide Position must be GLOBAL
                guides.push({
                    type: 'vertical',
                    position: targetPos + parentOffsetX,
                    start: Math.min(globalTop, parentGlobalTop),
                    end: Math.max(globalBottom, parentGlobalBottom),
                    alignmentType: type,
                });
            }
        });

        // Horizontal Checks (Snap Local Y)
        const horizontalChecks = [
            { dragPos: localTop, targetPos: parentTop, type: 'top' as const },
            { dragPos: localBottom, targetPos: parentBottom, type: 'bottom' as const },
            { dragPos: localCenterY, targetPos: parentCenterY, type: 'centerY' as const },
        ];
        horizontalChecks.forEach(({ dragPos, targetPos, type }) => {
            const dist = Math.abs(dragPos - targetPos);
            if (dist <= SNAP_THRESHOLD) {
                const offset = targetPos - dragPos;
                if (Math.abs(offset) < Math.abs(minSnapDistY)) {
                    minSnapDistY = offset;
                    snapOffset.y = offset; // Offset is LOCAL
                }
                guides.push({
                    type: 'horizontal',
                    position: targetPos + parentOffsetY,
                    start: Math.min(globalLeft, 0 + parentOffsetX),
                    end: Math.max(globalRight, parentRight + parentOffsetX),
                    alignmentType: type,
                });
            }
        });

        // Measurements (Gap to Parent) using LOCAL calc, converting to GLOBAL display
        // Left Gap
        if (localLeft > 0 && localLeft < 100) {
            measurements.push({
                type: 'horizontal',
                distance: localLeft, // Actual distance
                from: { x: 0 + parentOffsetX, y: globalCenterY }, // Global coordinates
                to: { x: localLeft + parentOffsetX, y: globalCenterY }
            });
        }
        // Right Gap
        const distRight = parent.width - localRight;
        if (distRight > 0 && distRight < 100) {
            measurements.push({
                type: 'horizontal',
                distance: distRight,
                from: { x: localRight + parentOffsetX, y: globalCenterY },
                to: { x: parent.width + parentOffsetX, y: globalCenterY }
            });
        }
        // Top Gap
        if (localTop > 0 && localTop < 100) {
            measurements.push({
                type: 'vertical',
                distance: localTop,
                from: { x: globalCenterX, y: 0 + parentOffsetY },
                to: { x: globalCenterX, y: localTop + parentOffsetY }
            });
        }
        // Bottom Gap
        const distBottom = parent.height - localBottom;
        if (distBottom > 0 && distBottom < 100) {
            measurements.push({
                type: 'vertical',
                distance: distBottom,
                from: { x: globalCenterX, y: localBottom + parentOffsetY },
                to: { x: globalCenterX, y: parent.height + parentOffsetY }
            });
        }

    } // End Parent Checks

    // 2. Check against Siblings
    comparisonNodes.forEach(([, node]) => {
        // Node positions are LOCAL to the same parent
        const nodeLeft = node.x;
        const nodeRight = node.x + node.width;
        const nodeTop = node.y;
        const nodeBottom = node.y + node.height;
        const nodeCenterX = node.x + node.width / 2;
        const nodeCenterY = node.y + node.height / 2;

        const nodeGlobalTop = nodeTop + parentOffsetY;
        const nodeGlobalBottom = nodeBottom + parentOffsetY;
        const nodeGlobalLeft = nodeLeft + parentOffsetX;
        const nodeGlobalRight = nodeRight + parentOffsetX;

        // Check vertical alignments
        const verticalChecks = [
            { dragPos: localLeft, nodePos: nodeLeft, type: 'left' as const },
            { dragPos: localLeft, nodePos: nodeRight, type: 'left' as const },
            { dragPos: localRight, nodePos: nodeRight, type: 'right' as const },
            { dragPos: localRight, nodePos: nodeLeft, type: 'right' as const },
            { dragPos: localCenterX, nodePos: nodeCenterX, type: 'centerX' as const },
        ];

        verticalChecks.forEach(({ dragPos, nodePos, type }) => {
            const dist = Math.abs(dragPos - nodePos);
            if (dist <= SNAP_THRESHOLD) {
                const offset = nodePos - dragPos;
                if (Math.abs(offset) < Math.abs(minSnapDistX)) {
                    minSnapDistX = offset;
                    snapOffset.x = offset; // Local Offset
                }

                guides.push({
                    type: 'vertical',
                    position: nodePos + parentOffsetX, // Global Position
                    start: Math.min(globalTop, nodeGlobalTop),
                    end: Math.max(globalBottom, nodeGlobalBottom),
                    alignmentType: type,
                });
            }
        });

        // Check horizontal alignments
        const horizontalChecks = [
            { dragPos: localTop, nodePos: nodeTop, type: 'top' as const },
            { dragPos: localTop, nodePos: nodeBottom, type: 'top' as const },
            { dragPos: localBottom, nodePos: nodeBottom, type: 'bottom' as const },
            { dragPos: localBottom, nodePos: nodeTop, type: 'bottom' as const },
            { dragPos: localCenterY, nodePos: nodeCenterY, type: 'centerY' as const },
        ];

        horizontalChecks.forEach(({ dragPos, nodePos, type }) => {
            const dist = Math.abs(dragPos - nodePos);
            if (dist <= SNAP_THRESHOLD) {
                const offset = nodePos - dragPos;
                if (Math.abs(offset) < Math.abs(minSnapDistY)) {
                    minSnapDistY = offset;
                    snapOffset.y = offset; // Local Offset
                }

                guides.push({
                    type: 'horizontal',
                    position: nodePos + parentOffsetY, // Global Position
                    start: Math.min(globalLeft, nodeGlobalLeft),
                    end: Math.max(globalRight, nodeGlobalRight),
                    alignmentType: type,
                });
            }
        });

        // Measurements (Gap between siblings)
        const horizontalGap = localLeft > nodeRight
            ? localLeft - nodeRight
            : nodeLeft > localRight
                ? nodeLeft - localRight
                : 0;

        const verticalGap = localTop > nodeBottom
            ? localTop - nodeBottom
            : nodeTop > localBottom
                ? nodeTop - localBottom
                : 0;

        // Show horizontal gap measurement (rendered in Global Space)
        if (horizontalGap > 0 && horizontalGap < 100) {
            const overlapY = !(localBottom < nodeTop || localTop > nodeBottom);
            if (overlapY) {
                measurements.push({
                    type: 'horizontal',
                    distance: horizontalGap,
                    from: {
                        x: (localLeft > nodeRight ? nodeRight : localRight) + parentOffsetX,
                        y: globalCenterY
                    },
                    to: {
                        x: (localLeft > nodeRight ? localLeft : nodeLeft) + parentOffsetX,
                        y: globalCenterY
                    },
                });
            }
        }

        if (verticalGap > 0 && verticalGap < 100) {
            const overlapX = !(localRight < nodeLeft || localLeft > nodeRight);
            if (overlapX) {
                measurements.push({
                    type: 'vertical',
                    distance: verticalGap,
                    from: {
                        x: globalCenterX,
                        y: (localTop > nodeBottom ? nodeBottom : localBottom) + parentOffsetY
                    },
                    to: {
                        x: globalCenterX,
                        y: (localTop > nodeBottom ? localTop : nodeTop) + parentOffsetY
                    },
                });
            }
        }
    });

    return { guides, measurements, snapOffset };
};
