import {
    markVisited,
    Node,
    Position,
    isNeighbor,
} from '../utils/HelperFunctions';

const directions: Position[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
];

export const bfs = (
    maze: Node[][],
    start: Position,
    end: Position
): Position[] => {
    // Create queue
    const queue: Position[] = [];
    queue.push(start);
    // Create set of visited positions
    const visited = new Set<string>();
    const visitedOrder: Position[] = [];

    // Start main loop
    while (queue.length > 0) {
        const currentPos = queue.shift();
        // Protection against undefined
        if (!currentPos) return [];
        if (currentPos.x === end.x && currentPos.y === end.y) {
            break;
        }
        const shuffledDirections = [...directions].sort(
            () => Math.random() - 0.5
        );
        for (let dir of shuffledDirections) {
            const nextPos = {
                x: currentPos.x + dir.x,
                y: currentPos.y + dir.y,
            };
            if (isNeighbor(nextPos, maze, visited)) {
                if (maze[nextPos.x][nextPos.y].type === 'path') {
                    visitedOrder.push(nextPos);
                }
                queue.push(nextPos);
                markVisited(visited, nextPos.x, nextPos.y);
            }
        }
    }
    return visitedOrder;
};
