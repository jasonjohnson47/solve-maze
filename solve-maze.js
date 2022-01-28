const maze = [
    [0, 0, 1, 0, 1],
    [1, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 1, 1, 0],
];

let mazeCopy = maze.map((row) => [...row]);

/*let nodesTraveled = [
    {x: 3, y: 0, to: 'down'}, // do we need this first one? to keep track of current entry point being tested?
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

const hasCloggedLevel = maze.some((level) =>
    level.every((space) => space == 1)
);

if (hasCloggedLevel) {
    return false;
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

const nodesTraveled = [];

const entryPoints = mazeCopy[0].reduce((acc, curr, index) => {
    if (curr == 0) {
        acc.push({ x: index, y: 0 });
    }
    return acc;
}, []);

entryPoints.forEach(function (entryPoint) {
    if (isZeroDown(mazeCopy, entryPoint)) {
        tryPath(mazeCopy, entryPoint);
    } else {
        console.log(`cannot move down at ${entryPoint.x}`);
    }
});

function tryPath(maze, point) {
    if (nodesTraveled.length > 10) {
        return false;
    } else {
        nodesTraveled.push(point);
        var currentNode = nodesTraveled[nodesTraveled.length - 1];
        var lastNode = nodesTraveled[nodesTraveled.length - 2];
        currentNode.try = getPossibleDirections(maze, point);

        if (
            lastNode &&
            lastNode.tried &&
            currentNode.try.includes(lastNode.tried)
        ) {
            currentNode.try = currentNode.try.filter(
                (dir) => !lastNode.tried.includes(dir)
            );
        }

        if (currentNode.try[0]) {
            if (currentNode.tried) {
                currentNode.tried.push(currentNode.try[0]);
            } else {
                currentNode.tried = [currentNode.try[0]];
            }

            makeMove(maze, point, currentNode.try[0]);

            currentNode.try.shift();
        } else {
            console.log('deadend');
        }
    }
}

function makeMove(maze, point, direction) {
    var newPoint = { ...point };

    if (direction == 'down') {
        newPoint.y = newPoint.y + 1;
    }
    if (direction == 'left') {
        newPoint.x = newPoint.x - 1;
    }
    if (direction == 'right') {
        newPoint.x = newPoint.x + 1;
    }
    if (direction == 'up') {
        newPoint.y = newPoint.y - 1;
    }

    console.log('newPoint', newPoint);

    tryPath(maze, newPoint);
}

console.log(nodesTraveled);

/*
check to see if any levels have all ones (no zeros), if so, maze cannot be completed
check to see if on last level, if so, maze completed

starting at an entry point on the top level, see if you can move down,
    if not, move on to test the next entry point
        if no more entry points, maze cannot be completed
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
