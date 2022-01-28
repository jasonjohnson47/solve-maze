const pot = [
    [0, 0, 1, 0, 1],
    [1, 1, 0, 0, 0],
    [0, 1, 0, 1, 0], 
    [0, 0, 0, 1, 0], 
    [1, 1, 1, 1, 0]
];

let potCopy = pot.map((row) => [...row]);

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
potCopy = [
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

const hasCloggedLevel = pot.some((level) => level.every((space) => space == 1));

if (hasCloggedLevel) {
    return false;
}

const entryPoints = potCopy[0].reduce((acc, curr, index) => {
    if (curr == 0) {
        acc.push(index);
    }
    return acc;
}, []);

function isZeroLeft(pot, node) {
    if (node.x == 0) {
        return false;
    }
    return pot[node.y][node.x - 1] == 0;
}
function isZeroRight(pot, node) {
    if (node.x == pot[node.y].length - 1) {
        return false;
    }
    return pot[node.y][node.x + 1] == 0;
}

console.log('isZeroLeft at {x: 0, y: 0}: ', isZeroLeft(potCopy, {x: 0, y: 0}));
console.log('isZeroLeft at {x: 3, y: 1}: ', isZeroLeft(potCopy, {x: 3, y: 1}));

console.log('isZeroRight at {x: 0, y: 0}: ', isZeroRight(potCopy, {x: 0, y: 0}));
console.log('isZeroRight at {x: 3, y: 1}: ', isZeroRight(potCopy, {x: 3, y: 1}));

function getPossibleDirections() {

}

//entryPoints.forEach();

/*
check to see if any levels have all ones (no zeros), if so, pot cannot drain
check to see if on last level, if so, pot can drain

starting at an entry point on the top level, see if you can move down,
    if not, move on to test the next entry point
        if no more entry points, pot cannot drain
    if so, move down and add the new node to the list of nodes traveled

    add all possible directions to the 'try' property ('down', 'left', 'right', 'up'; do not include the direction you came from)
    try one of the directions
        remove it from the 'try' array and move to that node
        add the new node to the list of nodes traveled

        when you reach a deadend...
        find the last node traveled that has a 'try' array with more directions to try
        update the potCopy to mark all later nodes as 1s
        continue from that last node trying one of the directions from the 'try' property (remove that direction from the 'try' array)

*/