console.log('hi');

var good = 'Good dog';
var bad = 'Bad dog';

var result = diff(good, bad);
console.log(result);
// [[-1, "Goo"], [1, "Ba"], [0, "d dog"]]

var derp = diff('same', 'same');
console.log(derp);
// [[0, 'same']]

var herp = diff("added", "addfed");
console.log(herp);

var flerp = diff("", "totally new");
console.log(flerp);

// Respect suggested edit location (cursor position), added in v1.1
// diff('aaa', 'aaaa', 1)
// [[0, "a"], [1, "a"], [0, "aa"]]

// For convenience
// diff.INSERT === 1;
// diff.EQUAL === 0;
// diff.DELETE === -1;
