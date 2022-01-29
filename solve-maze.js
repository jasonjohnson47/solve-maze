const maze1 = [
    [0, 0, 1, 0, 1],
    [1, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
];

const maze2 = [
    [0, 1, 1, 1, 1],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 1, 1, 0],
];

const maze3 = [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 1, 1, 0],
];

const maze4 = [
    [0, 0, 1, 0, 1],
    [1, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
];

let mazeCopy = maze4.map((row) => [...row]);

/*let nodesTraveled = [
    {x: 3, y: 0, to: 'down'}, // do we need this first one? to keep track of current entry node being tested?
    {x: 3, y: 1, to: 'left', try: ['right']},
    {x: 2, y: 1, to: 'down'},
    {x: 2, y: 2, to: 'down'},
    {x: 2, y: 3, to: 'left'},
    {x: 1, y: 3, to: 'left'},
    {x: 0, y: 3, to: 'up'},
    {x: 0, y: 2, to: null},
];
*/
// trying next direction...
/*
mazeCopy = [
    [1, 1, 1, 0, 1],
    [1, 1, 1, 0, 0],
    [1, 1, 1, 1, 0], 
    [1, 1, 1, 1, 0], 
    [1, 1, 1, 1, 0]
];

nodesTraveled = [
    {x: 3, y: 0, to: 'down'},
    {x: 3, y: 1, to: 'right', try: []},
    {x: 4, y: 1, to: 'down'},
    {x: 4, y: 2, to: 'down'},
    {x: 4, y: 3, to: 'down'},
    {x: 4, y: 4, to: 'down'},
];
*/

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

const hasCloggedLevel = mazeCopy.some((level) =>
    level.every((space) => space == 1)
);

if (hasCloggedLevel) {
    console.log('Cannot complete maze.');
}

const nodesTraveled = [];
let isMazeCompleted = false;

const entryNodes = mazeCopy[0].reduce((acc, curr, index) => {
    if (curr == 0) {
        acc.push({ x: index, y: 0 });
    }
    return acc;
}, []);

for (const entryNode of entryNodes) {
    if (isMazeCompleted) {
        break;
    }
    if (isZeroDown(mazeCopy, entryNode)) {
        tryPath(mazeCopy, entryNode);
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

/*
check to see if any levels have all ones (no zeros), if so, maze cannot be completed
check to see if on last level, if so, maze completed

starting at an entry node on the top level, see if you can move down,
    if not, move on to test the next entry node
        if no more entry nodes, maze cannot be completed
    if so, move down and add the new node to the list of nodes traveled

    add all possible directions to the 'try' property ('down', 'left', 'right', 'up'; do not include the direction you came from)
    try one of the directions
        remove it from the 'try' array and move to that node
        add the new node to the list of nodes traveled

        when you reach a deadend...
        find the last node traveled that has a 'try' array with more directions to try
        update the mazeCopy to mark all later nodes as 1s
        continue from that last node trying one of the directions from the 'try' property (remove that direction from the 'try' array)

*/
