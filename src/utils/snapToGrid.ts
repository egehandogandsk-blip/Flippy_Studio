export const snapToGrid = (value: number, gridSize = 1): number => {
    return Math.round(value / gridSize) * gridSize;
};

export const snapPointToGrid = (x: number, y: number, gridSize = 1) => {
    return {
        x: snapToGrid(x, gridSize),
        y: snapToGrid(y, gridSize)
    };
};
