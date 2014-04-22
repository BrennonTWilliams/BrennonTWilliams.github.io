// I paired by myself on this challenge.




// Pseudocode
//Judging by the driver code I know I need to define secretNumber, password, allowedIn, members
// SET number secretNumber to 7
// SET string password to "just open the door"
// SET boolean allowedIn to false
// SET array members to [John, placeholderName1, placeholderName2, Mary]


// __________________________________________
// Write your code below.

var secretNumber = 7;
var password = "just open the door";
var allowedIn = false;
var members = ["John", "Brennon", "Sam", "Mary"];


// __________________________________________
// Refactored Code: Include a refactored version (or justification of your original code) here. 

//I'm not really sure how to refactor this code, it seems like its as clean and simple as it could be.
//All I did was create the variables and assign values according to the driver code given below.



// __________________________________________
// Reflection: Use the reflection guidelines to write a reflection here. 
// I really enjoyed this assignment. I liked that I opened the file having no idea of what the objective was. I had 
// to play detective and figure out what the purpose of the program was. My mistake was going into this assignment with
// the mindset of "what is this program accomplishing?" Really, it was just a list of paramaters I needed to meet by
// creating a few variables. The solution was a lot simpler than I thought it would be.
// 
// 


// __________________________________________
// Driver Code:  Do not alter code below this line.

function assert(test, message, test_number) {
  if (!test) {
    console.log(test_number + "false");
    throw "ERROR: " + message;
  }
  console.log(test_number + "true");
  return true;
}

assert(
  (typeof secretNumber === 'number'),
  "The value of secretNumber should be a number.",
  "1. "
)

assert(
  secretNumber === 7,
  "The value of secretNumber should be 7.",
  "2. "
)

assert(
  typeof password === 'string',
  "The value of password should be a string.",
  "3. "
)

assert(
  password === "just open the door",
  "The value of password should be 'just open the door'.",
  "4. "
)

assert(
  typeof allowedIn === 'boolean',
  "The value of allowedIn should be a boolean.",
  "5. "
)

assert(
  allowedIn === false,
  "The value of allowedIn should be false.",
  "6. "
)

assert(
  members instanceof Array,
  "The value of members should be an array",
  "7. "
)

assert(
  members[0] === "John",
  "The first element in the value of members should be 'John'.",
  "8. "
)

assert(
  members[3] === "Mary",
  "The fourth element in the value of members should be 'Mary'.",
  "9. "
)

