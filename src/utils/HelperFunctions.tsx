export type NodeType =
    | 'start'
    | 'end'
    | 'wall'
    | 'path'
    | 'dfs'
    | 'bfs'
    | 'aStar'
    | 'dijkstra';

export type Node = {
    type: NodeType;
};

export type Position = {
    x: number;
    y: number;
};

export const markVisited = (
    visited: Set<string>,
    x: number,
    y: number
): void => {
    visited.add(`${x},${y}`);
};

export const isVisited = (
    visited: Set<string>,
    x: number,
    y: number
): boolean => {
    return visited.has(`${x},${y}`);
};

// If Neighbor is in maze, no wall and not visited
export const isNeighbor = (
    nextPos: Position,
    maze: Node[][],
    visited: Set<string>
): boolean => {
    const height = maze.length;
    const width = maze[0]?.length ?? 0;

    if (
        nextPos.x >= 0 &&
        nextPos.x < height &&
        nextPos.y >= 0 &&
        nextPos.y < width &&
        maze[nextPos.x][nextPos.y].type !== 'wall' &&
        !isVisited(visited, nextPos.x, nextPos.y)
    ) {
        return true;
    }
    return false;
};
