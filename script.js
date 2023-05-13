/*
Colton Melhase
SP2023 CS290
Coffman
5/14/2023
*/

//global variables to track goal, wins and losses
let goalNum = 0;
let winsNum = 0;
let lossesNum = 0;

//global variables to track selected numbers and operator.
let a = 0;
let b = 0;
let operator = "";

//global array to store game status values and variable to store current game status
const gameStatus = {
    START: 1,
    PICK_NUMBER: 2,
    PICK_OPERATOR: 3,
    PICK_SEC_NUMBER: 4,
    WIN: 5,
    LOSES: 6
};
let gstatus = gameStatus.START;

//When all content is loaded, run domLoaded
window.addEventListener("DOMContentLoaded", domLoaded);

/*
domLoaded() sets all necessary event listeners to all buttons in the webpage.
It also sets content of the goal, wins and losses.

After attaching all event listeners, call newGame to generate game numbers
*/
function domLoaded() {

    //Attach click event handler to new game button
    const newBtn = document.getElementById("newGame");
    newBtn.addEventListener("click", newGame);

    //Attach click event handlers to each number button
    const numberButtons = getNumberGridButtons();
    for(let button of numberButtons) {
        button.addEventListener("click", function () {boardButtonClicked(button);});
    }

    //Attach click event handlers to each operator button
    const operatorButtons = getOperatorButtons();
    for(let button of operatorButtons) {
        button.addEventListener("click", function () {operatorButtonClicked(button);})
    }

    //Set wins and losses to 0
    document.getElementById("wins").textContent = winsNum;
    document.getElementById("losses").textContent = lossesNum;

    newGame();
}

//return array of all number grid buttons
function getNumberGridButtons() {
    return document.querySelectorAll("#numberGrid > button");
}
//return array of all operator list buttons
function getOperatorButtons() {
    return document.querySelectorAll("#operatorList > button");
}
/*
newGame() generates random numbers(1-10) to assign for each number button in the number grid.
It also clears any content/children within the workspace.

Also generating new numbers, generate new goal and assign goal element with result.

Update the game status
*/
function newGame() {

    //reset number buttons
    const numberButtons = getNumberGridButtons();
    for(let button of numberButtons) {
        button.removeAttribute("disabled");
        button.textContent = Math.floor(Math.random() * 10 + 1);
        button.removeAttribute("disabled");
    }

    //clear work area
    let workSpace = document.getElementById("work");
    while(workSpace.hasChildNodes()) {
        workSpace.removeChild(workSpace.firstChild);
    }
    //generate new goal
    document.getElementById("goal").innerText = generateGoal();

    //update game status
    document.getElementById("gameStatus").innerText = "Let's Play!"
    gstatus = gameStatus.START;
}
/*
generateGoal() must be called after numbers are generated for the number buttons.

Randomly selects three different buttons and two operators to calculate goal.

Returns goal result
*/
function generateGoal() {

    //Compile array of numbers from number grid
    let numbers = [];
    let numberButtons = getNumberGridButtons();
    for(let button of numberButtons) {
        numbers.push(parseInt(button.textContent))
    }

    //generate three non-equal random indexes 
    let x = Math.floor(Math.random() * 4);
    let y = Math.floor(Math.random() * 4);
    let z = Math.floor(Math.random() * 4);
    while(x == y || x == z || z == y) {
        x = Math.floor(Math.random() * 4);
        y = Math.floor(Math.random() * 4);
        z = Math.floor(Math.random() * 4);
    }
    console.log(numbers[x] + " " + numbers[y] + " " + numbers[z])
    //generate random numbers to assign two operators
    let operator = Math.floor(Math.random() * 3);
    let operator2 = Math.floor(Math.random() * 3);

    //compute goal
    if(operator == 0) {
        if(operator2 == 0)
        {
            goalNum = (numbers[x] + numbers[y]) + numbers[z];
        }
        else if(operator2 == 1) {
            goalNum = (numbers[x] + numbers[y]) - numbers[z];
        }
        else {
            goalNum = (numbers[x] + numbers[y]) * numbers[z];
        }
    }
    else if(operator == 1) {
        if(operator2 == 0)
        {
            goalNum = (numbers[x] - numbers[y]) + numbers[z];
        }
        else if(operator2 == 1) {
            goalNum = (numbers[x] - numbers[y]) - numbers[z];
        }
        else {
            goalNum = (numbers[x] - numbers[y]) * numbers[z];
        }
    }
    else {
        if(operator2 == 0)
        {
            goalNum = (numbers[x] * numbers[y]) * numbers[z];
        }
        else if(operator2 == 1) {
            goalNum = (numbers[x] * numbers[y]) * numbers[z];
        }   
        else {
            goalNum = (numbers[x] * numbers[y]) * numbers[z];
        }
    }
    return goalNum;
}

/*
boardButtonClicked(button) takes a button element, and depending on the game status,
assigns the number value to a or b. Then disable the button to prevent using the button twice.

If the button pressed is the second value in the equation, completely clear both the first and second selected button
Then call checkResults to calculate the equation the user made.
*/
function boardButtonClicked(button) {
    //if button is the first button to be pressed
    if(gstatus == 1 || gstatus == 2) {
        //get number value from button and assign to b
        let num = button.textContent;
        a = parseInt(num);

        //disable button
        button.disabled = true;

        //Now make user select operator
        gstatus = gameStatus.PICK_OPERATOR;
        document.getElementById("gameStatus").innerText = "Select an operator";
    }
    //if button is the second button to be pressed
    else if(gstatus == 4) {
        //get number value from button and assign to b
        let num = button.textContent;
        b = parseInt(num);

        //disable button
        button.disabled = true;
        button.textContent = "";
        //clear first selected button
        let numberButtons = getNumberGridButtons();
        for(let button of numberButtons) {
            if(button.disabled == true) {
                button.textContent = "";
            }
        }
        //check if user's equation matches
        checkResult();
    }
}

/*
operatorButtonClicked(button) takes a button element and checks if the game status
allows an operator to be selected.
Stores selected operator value to global operator variable.

Disable selected operator, and update game status.
*/
function operatorButtonClicked(button) {
    //if game status is at operator stage.
    if(gstatus == 3) {
        //Store operator value in global operator variable
        let operatorSign = button.textContent;
        operator = operatorSign;

        //disable operator
        button.disabled = true;

        //update game status
        gstatus = gameStatus.PICK_SEC_NUMBER;
        document.getElementById("gameStatus").innerText = "Select a number";
    }
}

/*
checkResult() is called after a, b, and the operator is chosen by the user.
Calculates result depending on the user choices.

Add the result back into the number grid.

Enable all operator buttons

Update work area with user's equation

Then check if result matches the goal.
    If goal matches, display win message, increment win value, and update game status.
Else if, more options are available.
    If more options are available,  update game status to choose number.
Else,
    User failed to match goal, update game status, display losing message.
*/
function checkResult() {
    //calculate user's result
    let result = 0;
    if(operator == "+") {
        result = a + b;
    }
    else if(operator == "-") {
        result = a - b;
    }
    else {
        result = a * b;
    }

    //add result back into number grid
    let numberButtons = getNumberGridButtons();
    for(let button of numberButtons) {
        if(button.disabled == true) {
            button.textContent = result;
            button.removeAttribute("disabled");
            break;
        }
    }
    //reset operator buttons
    let operatorButtons = getOperatorButtons();
    for(let button of operatorButtons) {
        if(button.disabled == true) {
            button.removeAttribute("disabled");
            break;
        }
    }

    //update work area.
    let text = document.createTextNode(a + " " + operator + " " + b + " " + "= " + result)
    let br = document.createElement("br");
    document.getElementById("work").appendChild(text);
    document.getElementById("work").appendChild(br);

    //if result is the goal
    if(result == goalNum) {
        document.getElementById("wins").textContent = ++winsNum;
        gstatus = gameStatus.WIN;
        document.getElementById("gameStatus").innerText = "You won!!!"
    }
    //if result is not in the goal, and options are still available.
    else if(checkKeepPlaying()) {
        gstatus = gameStatus.PICK_NUMBER;
        document.getElementById("gameStatus").innerText = "Select a number";
    }
    //if result is not goal and no more options are left
    else {
        document.getElementById("losses").textContent = ++lossesNum;
        gstatus = gameStatus.LOSES;
        document.getElementById("gameStatus").innerText = "Game Over! Better Luck Next Time";
    }
}

/*
checkKeepPlaying() checks if there are still sufficient amount of options
for the user to keep playing with. If there are not two or more options left,
return false.

If there are sufficient amount of options left, return true.
*/
function checkKeepPlaying() {
    //count available options remaining
    let numberButtons = getNumberGridButtons();
    let available = 4;
    for(let button of numberButtons) {
        if(button.disabled == true) {
            available--;
        }
    }
    

    //return true/false
    if(available >= 2) {
        return true;
    }
    else {
        return false;
    }
}