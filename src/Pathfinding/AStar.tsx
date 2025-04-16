import { Node, Position } from '../utils/HelperFunctions';

const directions: Position[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
];

type weightedNode = {
    position: Position;
    cost: number;
};

const computeManhattenDistance = (pos: Position, end: Position) => {
    return Math.abs(pos.x - end.x) + Math.abs(pos.y - end.y);
};

const findMinCost = (weightedNodes: weightedNode[]): number => {
    let min = weightedNodes[0].cost;
    let index = 0;
    for (let i = 0; i < weightedNodes.length; i++) {
        if (weightedNodes[i].cost < min) {
            min = weightedNodes[i].cost;
            index = i;
        }
    }
    return index;
};

export const isNeighbor = (nextPos: Position, maze: Node[][]): boolean => {
    const height = maze.length;
    const width = maze[0]?.length ?? 0;

    if (
        nextPos.x >= 0 &&
        nextPos.x < height &&
        nextPos.y >= 0 &&
        nextPos.y < width &&
        maze[nextPos.x][nextPos.y].type !== 'wall'
    ) {
        return true;
    }
    return false;
};

const getgScore = (pos: Position, gScores: Map<string, number>): number => {
    if (!gScores.has(`${pos.x},${pos.y}`)) {
        return Infinity;
    } else {
        return gScores.get(`${pos.x},${pos.y}`)!;
    }
};

export const aStar = (
    maze: Node[][],
    start: Position,
    end: Position
): Position[] => {
    // Setup
    // Order of visited Cells
    const visitedOrder: Position[] = [];
    // Stores all nodes that need to be checked
    // Used to find node with smallest cost
    const weightedNodes: weightedNode[] = [];
    // Current gScore of all Nodes
    // Used to store distance to all nodes globally
    // for faster comparison
    const gScore = new Map<string, number>();

    const startNode: weightedNode = {
        position: start,
        cost: 0 + computeManhattenDistance(start, end),
    };
    weightedNodes.push(startNode);
    gScore.set(`${startNode.position.x},${startNode.position.y}`, 0);

    while (weightedNodes.length > 0) {
        // Choose the node with the smallest cost
        const currentIndex = findMinCost(weightedNodes);
        const current = weightedNodes[currentIndex];
        const currentPosition = current.position;
        // Remove current from weightedNodes
        weightedNodes.splice(currentIndex, 1);
        // If current === end return
        if (currentPosition.x === end.x && currentPosition.y === end.y) {
            return visitedOrder;
        }
        // Add node to visitedOrder
        if (maze[currentPosition.x][currentPosition.y].type === 'path') {
            visitedOrder.push(currentPosition);
        }

        // Check all neighbors of current
        const shuffledDirections = [...directions].sort(
            () => Math.random() - 0.5
        );
        for (let dir of shuffledDirections) {
            const nextPos = {
                x: currentPosition.x + dir.x,
                y: currentPosition.y + dir.y,
            };
            // Check if real neighbor
            if (isNeighbor(nextPos, maze)) {
                // Compute next g Score
                const currentgScore = getgScore(currentPosition, gScore);
                const nextgScore = getgScore(nextPos, gScore);
                if (nextgScore > currentgScore + 1) {
                    gScore.set(`${nextPos.x},${nextPos.y}`, currentgScore + 1);
                    const fScore =
                        currentgScore +
                        1 +
                        computeManhattenDistance(nextPos, end);
                    weightedNodes.push({ position: nextPos, cost: fScore });
                }
            }
        }
    }
    return visitedOrder;
};
