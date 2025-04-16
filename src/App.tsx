import { useState } from 'react';
import './App.css';
import { createMaze } from './Maze/Maze';
import { bfs } from './Pathfinding/BFS';
import { Node, Position } from './utils/HelperFunctions';
import { dfs } from './Pathfinding/DFS';
import { aStar } from './Pathfinding/AStar';
import { dijkstra } from './Pathfinding/Dijkstra';

export type MazeInfo = {
    maze: Node[][];
    start: Position;
    end: Position;
};

function App() {
    const [mazeInfo, setMazeInfo] = useState<MazeInfo>(createMaze(27, 21));

    const handleMazeCreation = (width: number, height: number) => {
        setMazeInfo(createMaze(width, height));
    };

    const handleClearMaze = () => {
        const maze = mazeInfo.maze;
        const height = maze.length;
        const width = maze[0]?.length ?? 0;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (
                    maze[i][j].type !== 'wall' &&
                    maze[i][j].type !== 'start' &&
                    maze[i][j].type !== 'end'
                ) {
                    maze[i][j].type = 'path';
                }
            }
        }
        setMazeInfo({
            maze: [...maze],
            start: mazeInfo.start,
            end: mazeInfo.end,
        });
    };
    const algorithms = {
        bfs: bfs,
        dfs: dfs,
        aStar: aStar,
        dijkstra: dijkstra,
    };

    const handlePathfinding = (
        algorithm: 'bfs' | 'dfs' | 'aStar' | 'dijkstra'
    ) => {
        const illustratePathfinding = algorithms[algorithm];
        const visitedPositions = illustratePathfinding(
            mazeInfo.maze,
            mazeInfo.start,
            mazeInfo.end
        );
        const maze = mazeInfo.maze;
        // Note for myself: setTimeout schedules code to run after a fixed delay from now.
        // If you use the same delay (e.g. 1000) in a loop, all timeouts run at the same time.
        // Using i * delay (e.g. i * 30) creates a staggered effect, so each cell updates one after another.

        for (let i = 0; i < visitedPositions.length; i++) {
            const pos = visitedPositions[i];
            setTimeout(() => {
                maze[pos.x][pos.y].type = algorithm;
                setMazeInfo({
                    maze: [...maze], // React needs to detect re-render
                    start: mazeInfo.start,
                    end: mazeInfo.end,
                });
            }, i * 30);
        }
    };

    const handleReplaceWall = (x: number, y: number) => {
        const maze = mazeInfo.maze;
        if (maze[x][y].type === 'wall') {
            maze[x][y].type = 'path';
        }
        setMazeInfo({
            maze: [...maze],
            start: mazeInfo.start,
            end: mazeInfo.end,
        });
    };

    return (
        <div className="container">
            <div className="buttonRow">
                <button onClick={() => handleMazeCreation(27, 21)}>
                    Refresh Maze
                </button>
                <button onClick={() => handleClearMaze()}>Clear Paths</button>
                <button onClick={() => handlePathfinding('bfs')}>BFS</button>
                <button onClick={() => handlePathfinding('dfs')}>DFS</button>
                <button onClick={() => handlePathfinding('dijkstra')}>
                    Dijkstra
                </button>
                <button onClick={() => handlePathfinding('aStar')}>A*</button>
            </div>
            <div className="maze">
                {mazeInfo.maze.map((row, rowIndex) => (
                    <div className="row" key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            <div
                                className={`cell ${cell.type}`}
                                key={cellIndex}
                                onClick={() =>
                                    handleReplaceWall(rowIndex, cellIndex)
                                }
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="info">Click on a wall to delete it!</div>
            <footer
                style={{
                    fontSize: '0.8rem',
                    marginTop: '2rem',
                    textAlign: 'center',
                }}
            >
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://icons8.com/icons/set/labyrinth"
                >
                    Labyrinth
                </a>{' '}
                Icon from{' '}
                <a target="_blank" rel="noreferrer" href="https://icons8.com">
                    Icons8
                </a>
            </footer>
        </div>
    );
}

export default App;
