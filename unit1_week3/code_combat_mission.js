console.log("You are in an underground dungeon. You need to find the hatch to escape, but watch out, there are traps too! 
	Enter u,d,l,r to walk up, down, left, right respectively");

var traps = [[4,4],[8,2],[5,6]]; //these are the trap XY locations, hit one and the game resets

var heroX = 1; //our hero's starting coordinates, 1,1.
var heroY = 1;

var hatchX = 7; //our escape hatch
var hatchY = 5;


// var keypress = require('keypress');

// // make `process.stdin` begin emitting "keypress" events
// keypress(process.stdin);

// // listen for the "keypress" event
// process.stdin.on('keypress', function (ch, key) {
//   console.log('got "keypress"', key);
//   if (key && key.ctrl && key.name == 'c') {
//   }
//   if (key.name == 'a') {
//   	console.log("A!");
//   }
// });
// var readline = require('readline'),
// rl = readline.createInterface(process.stdin, process.stdout);

// rl.on('line', function (cmd) {
//   console.log('You just typed: '+cmd);
// });

var taunt=function(taunt) {
  prompt("Type your taunt here", taunt);
}