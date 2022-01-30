import { maze1 } from './mazes.mjs';

const mazeArray = maze1.map((row) => [...row]);
const mazeContainer = document.getElementById('maze');

function renderMaze(maze) {
    maze.forEach((row, i) => {
        row.forEach((node, j) => {
            const nodeElem = document.createElement('div');
            nodeElem.id = 'x' + j + 'y' + i;
            nodeElem.classList.add('node');
            if (node == 1) {
                nodeElem.classList.add('node-blocked');
            }
            mazeContainer.appendChild(nodeElem);
        });
    });
}
renderMaze(mazeArray);

function isZeroLeft(maze, node) {
    if (node.x == 0) {
        return false;
    }
    return maze[node.y][node.x - 1] == 0;
}
function isZeroRight(maze, node) {
    if (node.x == maze[node.y].length - 1) {
        return false;
    }
    return maze[node.y][node.x + 1] == 0;
}
function isZeroDown(maze, node) {
    if (node.y == maze.length - 1) {
        return false;
    }
    return maze[node.y + 1][node.x] == 0;
}
function isZeroUp(maze, node) {
    if (node.y == 0) {
        return false;
    }
    return maze[node.y - 1][node.x] == 0;
}

function getPossibleDirections(maze, node) {
    const possibleDirections = [];

    if (isZeroDown(maze, node)) {
        possibleDirections.push('down');
    }
    if (isZeroLeft(maze, node)) {
        possibleDirections.push('left');
    }
    if (isZeroRight(maze, node)) {
        possibleDirections.push('right');
    }
    if (isZeroUp(maze, node)) {
        possibleDirections.push('up');
    }

    return possibleDirections;
}

const hasCloggedLevel = mazeArray.some((level) =>
    level.every((space) => space == 1)
);

if (hasCloggedLevel) {
    console.log('Cannot complete maze.');
}

const nodesTraveled = [];
let isMazeCompleted = false;

const entryNodes = mazeArray[0].reduce((acc, curr, index) => {
    if (curr == 0) {
        acc.push({ x: index, y: 0 });
    }
    return acc;
}, []);

for (const entryNode of entryNodes) {
    if (isMazeCompleted) {
        break;
    }
    if (isZeroDown(mazeArray, entryNode)) {
        tryPath(mazeArray, entryNode);
    } else {
        console.log(`cannot move down at ${entryNode.x}`);
    }
}

function tryPath(maze, node) {

    if (node.hasOwnProperty('try') && node.try.length) {
        // back tracking to a node, do not reset possible directions in 'try'
    } else {
        var possibleDirections = getPossibleDirections(maze, node);

        node.try = possibleDirections.filter((possibleDirection) => {
            var prevNode = nodesTraveled[nodesTraveled.length - 1];
            if (prevNode) {
                var prevNodeDirection = prevNode.to;

                if (prevNodeDirection == 'left') {
                    return possibleDirection != 'right';
                }
                if (prevNodeDirection == 'right') {
                    return possibleDirection != 'left';
                }
                if (prevNodeDirection == 'up') {
                    return possibleDirection != 'down';
                }
                if (prevNodeDirection == 'down') {
                    return possibleDirection != 'up';
                }
            } else {
                return true;
            }
        });
    }

    if (node.try.length) {
        var directionToMove = node.try[0];
        node.try.shift();
        node.to = directionToMove;
        nodesTraveled.push(node);
        makeMove(maze, node, directionToMove);
    } else {
        var backTrackNode =
            getLastNodeWithMoreDirectionsToTry(nodesTraveled);

        if (backTrackNode) {
            console.log('backTrackNode: ', backTrackNode);
            if (node.y != maze.length - 1) {
                tryPath(maze, {...backTrackNode});
            } else {
                console.log(`Maze completed! Exited at node: x: ${node.x}, y: ${node.y}`);
                isMazeCompleted = true;
            }
        } else {
            if (node.y != maze.length - 1) {
                console.log('Cannot complete maze :(');
            }
        }
    }

    if (node.y == maze.length - 1) {
        console.log(`Maze completed! Exited at node: x: ${node.x}, y: ${node.y}`);
        isMazeCompleted = true;
    }

}

function getLastNodeWithMoreDirectionsToTry(nodesTraveled) {
    const nodesWithDirectionsToTry = nodesTraveled.filter(
        (node) => node.try && node.try.length > 0
    );
    const lastNodeWithDirectionsToTry =
        nodesWithDirectionsToTry[nodesWithDirectionsToTry.length - 1];
    return lastNodeWithDirectionsToTry;
}

function makeMove(maze, node, direction) {
    var { x, y } = node;

    if (direction == 'down') {
        y = y + 1;
    }
    if (direction == 'left') {
        x = x - 1;
    }
    if (direction == 'right') {
        x = x + 1;
    }
    if (direction == 'up') {
        y = y - 1;
    }

    tryPath(maze, { x, y });
    
}

console.log(nodesTraveled);

function renderPathTraveled(maze, nodesTraveled) {
    nodesTraveled.forEach((nodeTraveled) => {
        const nodeCoords = 'x' + nodeTraveled.x + 'y' + nodeTraveled.y;
        maze.querySelector('#'+nodeCoords).classList.add('node-visited');
    });
}
renderPathTraveled(mazeContainer, nodesTraveled);