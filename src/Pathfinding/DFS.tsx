import {
    isNeighbor,
    markVisited,
    Node,
    Position,
} from '../utils/HelperFunctions';

const directions: Position[] = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
];

type State = { found: boolean };

// recursive dfs
export const dfs = (
    maze: Node[][],
    start: Position,
    end: Position
): Position[] => {
    // Set up
    const visitedOrder: Position[] = [];
    const visited = new Set<string>();
    const state: State = { found: false };

    recursiveStep(maze, start, end, visitedOrder, visited, state);

    return visitedOrder;
};

const recursiveStep = (
    maze: Node[][],
    current: Position,
    end: Position,
    visitedOrder: Position[],
    visited: Set<string>,
    state: State
) => {
    if (state.found) {
        return visitedOrder;
    }
    markVisited(visited, current.x, current.y);
    if (maze[current.x][current.y].type === 'path') {
        visitedOrder.push(current);
    }
    if (current.x === end.x && current.y === end.y) {
        state.found = true;
        return visitedOrder;
    }
    const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);
    for (let dir of shuffledDirections) {
        const nextPos = {
            x: current.x + dir.x,
            y: current.y + dir.y,
        };
        if (isNeighbor(nextPos, maze, visited)) {
            recursiveStep(maze, nextPos, end, visitedOrder, visited, state);
        }
    }
};
