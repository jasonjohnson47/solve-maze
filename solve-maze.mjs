import {
    maze1,
    maze2,
    maze3,
    maze4,
    maze5,
    maze6,
    maze7,
    maze8,
    maze9,
} from './mazes.mjs';

const mazeArray = maze9.map((row) => [...row]);
const mazeContainer = document.getElementById('maze');
const nodesTraveled = [];
let isMazeCompleted = false;
const nodesTraveledLookup = generateEmptyLookup(mazeArray);
const backTrackNodes = [];

function generateEmptyLookup(maze) {
    const emptyLookup = [];
    const numOfRows = maze.length;
    const numOfCols = maze[0].length;
    for (let i = 0; i < numOfRows; i++) {
        emptyLookup.push(Array(numOfCols).fill(null));
    }
    return emptyLookup;
}

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
            mazeContainer.style.width = maze[0].length * 20 + 4 + 'px';
        });
    });
}
renderMaze(mazeArray);

function renderPathTraveled(maze, nodesTraveled) {
    nodesTraveled.forEach((nodeTraveled, index) => {
        const nodeCoords = 'x' + nodeTraveled.x + 'y' + nodeTraveled.y;
        const speed = (index + 1) * 200;
        setTimeout(function () {
            const nodeEl = maze.querySelector('#' + nodeCoords);
            nodeEl.classList.remove('node-visited');
            void nodeEl.offsetWidth; // trigger reflow to restart css transition
            nodeEl.classList.add('node-visited');
        }, speed);
    });
}

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

const hasCloggedLevel = mazeArray.some((level) =>
    level.every((space) => space == 1)
);

if (hasCloggedLevel) {
    console.log('Cannot complete maze.');
}

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
        enterNodeAndAssess(mazeArray, entryNode);
    } else {
        console.log(`cannot move down at ${entryNode.x}`);
    }
}

function getPossibleDirections(maze, nodesTraveled, nodesTraveledLookup, node) {
    const possibleDirections = [];

    // find adjacent 0s
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

    // exclude 'from' directions
    const possibleDirectionsFilterOutFrom = possibleDirections.filter(
        (direction) => {
            return !node.from.includes(direction);
        }
    );

    // look ahead to nodes that are 0s
    // see if they've been visited before
    // and have directions they can still try

    const possibleNodes = possibleDirectionsFilterOutFrom.map((direction) => {
        return getNextNodeCoords(node, direction);
    });

    const possibleNodesIndexes = possibleNodes
        .flatMap((possibleNode) => {
            return nodesTraveledLookup[possibleNode.y][possibleNode.x];
        })
        .filter((nodeIndexValue) => nodeIndexValue != null);

    if (possibleNodesIndexes.length) {
        const possibleNodesToExclude = possibleNodesIndexes
            .map((i) => {
                return nodesTraveled[i];
            })
            .filter((nodeTraveled) => {
                return (
                    nodeTraveled?.possibleDirections.length == 0 ||
                    nodeTraveled?.possibleDirections?.length ==
                        nodeTraveled?.went?.length
                );
            });

        const directionsToExclude = possibleNodesToExclude.map(
            (nodeToExclude) => {
                return getDirectionRelativeToNode(node, nodeToExclude);
            }
        );

        const possibleDirectionsFiltered =
            possibleDirectionsFilterOutFrom.filter((possibleDirection) => {
                return !directionsToExclude.includes(possibleDirection);
            });

        return possibleDirectionsFiltered;
    } else {
        return possibleDirectionsFilterOutFrom;
    }
}

function getDirectionRelativeToNode(node, adjacentNode) {
    if (adjacentNode.x > node.x) {
        return 'right';
    }
    if (adjacentNode.x < node.x) {
        return 'left';
    }
    if (adjacentNode.y > node.y) {
        return 'down';
    }
    if (adjacentNode.y < node.y) {
        return 'up';
    }
}

function getNextNodeCoords(node, direction) {
    let { x, y } = node;

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

    return { x, y };
}

function getOppositeDirection(direction) {
    if (direction == 'left') {
        return 'right';
    }
    if (direction == 'right') {
        return 'left';
    }
    if (direction == 'up') {
        return 'down';
    }
    if (direction == 'down') {
        return 'up';
    }
}

function getFrom(nodesTraveled, node) {
    if (!nodesTraveled.length) {
        return ['up'];
    }
    const prevNode = nodesTraveled[nodesTraveled.length - 1];

    if (prevNode.went) {
        const prevNodeWent = prevNode.went[prevNode.went.length - 1];
        return getOppositeDirection(prevNodeWent);
    }
}

function getHistoryOfNode(nodesTraveled, nodesTraveledLookup, node) {
    // find last node in nodesTraveled that has the same x/y coordinates
    // return a copy of that object
    const indexesInNodesTraveled = nodesTraveledLookup[node.y][node.x];

    if (indexesInNodesTraveled) {
        const highestIndex =
            indexesInNodesTraveled[indexesInNodesTraveled.length - 1];
        const mostRecentNodeHistory = nodesTraveled[highestIndex];
        return _.cloneDeep(mostRecentNodeHistory);
    } else {
        return false;
    }
}

function enterNodeAndAssess(maze, node) {
    let currNode = _.cloneDeep(node);

    if (currNode.y == maze.length - 1) {
        nodesTraveled.push(currNode);
        isMazeCompleted = true;
        console.log(
            `Maze completed!!! Exited at node: x: ${currNode.x}, y: ${currNode.y}`
        );
        return false;
    }

    currNode =
        getHistoryOfNode(nodesTraveled, nodesTraveledLookup, currNode) ||
        currNode;

    const fromDirection = getFrom(nodesTraveled, currNode);
    if (!currNode.from) {
        currNode.from = [fromDirection];
    } else {
        currNode.from.push(fromDirection);
    }

    currNode.possibleDirections = getPossibleDirections(
        mazeArray,
        nodesTraveled,
        nodesTraveledLookup,
        currNode
    );

    const wentDirection = currNode.possibleDirections[0];
    if (wentDirection) {
        if (!currNode.went) {
            currNode.went = [wentDirection];
        } else {
            currNode.went.push(wentDirection);
        }
    }

    nodesTraveled.push(currNode);

    if (nodesTraveledLookup[currNode.y][currNode.x]) {
        nodesTraveledLookup[currNode.y][currNode.x].push(
            nodesTraveled.length - 1
        );
    } else {
        nodesTraveledLookup[currNode.y][currNode.x] = [
            nodesTraveled.length - 1,
        ];
    }

    //console.log(currNode);

    if (currNode.possibleDirections.length >= 2) {
        backTrackNodes.push(nodesTraveled.length - 1);
    }

    if (currNode.possibleDirections.length) {
        enterNodeAndAssess(
            maze,
            getNextNodeCoords(currNode, currNode.went[currNode.went.length - 1])
        );
    } else {
        if (backTrackNodes.length) {
            const backTrackNodeIndex = backTrackNodes.pop();
            const backTrackNode = _.cloneDeep(
                nodesTraveled[backTrackNodeIndex]
            );
            enterNodeAndAssess(maze, backTrackNode);
        } else {
            console.log('no where to go, cannot complete maze');
        }
    }
}

console.log(nodesTraveled);
console.log(nodesTraveledLookup);
renderPathTraveled(mazeContainer, nodesTraveled);
