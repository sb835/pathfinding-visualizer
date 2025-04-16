import { MazeInfo } from '../App';
import {
    isVisited,
    markVisited,
    Node,
    Position,
} from '../utils/HelperFunctions';

const directions: Position[] = [
    { x: 2, y: 0 },
    { x: -2, y: 0 },
    { x: 0, y: 2 },
    { x: 0, y: -2 },
];

const inMaze = (width: number, height: number, x: number, y: number) => {
    if (x >= 0 && x < height && y >= 0 && y < width) {
        return true;
    }
    return false;
};

// Return neighbor in random direction if one exists who is not visited
const findRandomNeighbor = (
    node: Position,
    visited: Set<string>,
    width: number,
    height: number
): Position | undefined => {
    const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);
    for (let dir of shuffledDirections) {
        const newNode: Position = { x: node.x + dir.x, y: node.y + dir.y };
        if (
            inMaze(width, height, newNode.x, newNode.y) &&
            !isVisited(visited, newNode.x, newNode.y)
        ) {
            return newNode;
        }
    }
    return undefined;
};

// Compute Node between two Nodes
const computeNodeBetween = (node1: Position, node2: Position): Position => {
    return {
        x: Math.floor((node1.x + node2.x) / 2),
        y: Math.floor((node1.y + node2.y) / 2),
    };
};

const carvePath = (maze: Node[][], from: Position, to: Position) => {
    const nodeBetween = computeNodeBetween(from, to);
    maze[nodeBetween.x][nodeBetween.y] = { type: 'path' };
    maze[to.x][to.y] = { type: 'path' };
};

export const createMaze = (width: number, height: number): MazeInfo => {
    // Create maze with only wall cells
    const maze: Node[][] = [];
    for (let i = 0; i < height; i++) {
        const row: Node[] = [];
        for (let j = 0; j < width; j++) {
            row.push({ type: 'wall' });
        }
        maze.push(row);
    }

    // Maze paths are generated through recursive backtracking

    // Set start point
    const startPosition = { x: 1, y: 1 };
    const endPosition = { x: 1, y: width - 2 };

    // Create stack and visited Nodes
    const visited = new Set<string>();
    markVisited(visited, startPosition.x, startPosition.y);
    const stack: Position[] = [];
    stack.push(startPosition);

    while (stack.length > 0) {
        const currentNode = stack.pop();
        // Protection against undefined
        if (!currentNode) continue;

        // Find random neighbor that was not visited
        const nextNode = findRandomNeighbor(
            currentNode,
            visited,
            width,
            height
        );
        if (nextNode) {
            stack.push(currentNode);
            // Create path
            carvePath(maze, currentNode, nextNode);
            markVisited(visited, nextNode.x, nextNode.y);
            stack.push(nextNode);
        }
    }

    maze[startPosition.x][startPosition.y] = { type: 'start' };
    maze[endPosition.x][endPosition.y] = { type: 'end' };

    return { maze: maze, start: startPosition, end: endPosition };
};
