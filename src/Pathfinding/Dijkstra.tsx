import { Node, Position } from '../utils/HelperFunctions';

const directions: Position[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
];

type weightedNode = {
    position: Position;
    distance: number;
};

const findMinDistance = (weightedNodes: weightedNode[]): number => {
    let min = weightedNodes[0].distance;
    let index = 0;
    for (let i = 0; i < weightedNodes.length; i++) {
        if (weightedNodes[i].distance < min) {
            min = weightedNodes[i].distance;
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

const getDistance = (pos: Position, distance: Map<string, number>): number => {
    if (!distance.has(`${pos.x},${pos.y}`)) {
        return Infinity;
    } else {
        return distance.get(`${pos.x},${pos.y}`)!;
    }
};

export const dijkstra = (
    maze: Node[][],
    start: Position,
    end: Position
): Position[] => {
    // Setup
    // Order of visited Cells
    const visitedOrder: Position[] = [];
    // Stores all nodes that need to be checked
    // Used to find node with smallest distance
    const weightedNodes: weightedNode[] = [];
    // Current distance of all Nodes
    // Used to store distance to all nodes globally
    // for faster comparison
    const distance = new Map<string, number>();

    const startNode: weightedNode = {
        position: start,
        distance: 0,
    };
    weightedNodes.push(startNode);
    distance.set(`${startNode.position.x},${startNode.position.y}`, 0);

    while (weightedNodes.length > 0) {
        // Choose the node with the smallest distance
        const currentIndex = findMinDistance(weightedNodes);
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
                // Compare distance
                const currentDistance = getDistance(currentPosition, distance);
                const nextDistance = getDistance(nextPos, distance);
                if (nextDistance > currentDistance + 1) {
                    distance.set(
                        `${nextPos.x},${nextPos.y}`,
                        currentDistance + 1
                    );
                    const dis = currentDistance + 1;
                    weightedNodes.push({ position: nextPos, distance: dis });
                }
            }
        }
    }
    return visitedOrder;
};
