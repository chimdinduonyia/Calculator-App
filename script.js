
const activeDisplay = document.querySelector("#activeDisplay");
const evalDisplay = document.querySelector("#evalDisplay");

const signs = "+-×÷(."; //A closed set of Signs to control the allowed arrangement of signs in the program
const numbers =  "0123456789"; //A closed set of numbers to control the allowed arrangement of numbers in the program

let evaluated = false; //A boolean to tell when the equals to button has been clicked


function writeToDisplay(value){ //Function to write a value onto the display

    const currentScreen = activeDisplay.value; //Get value on the most current active screen

    if(evaluated){ //If equals to sign has already been clicked, empty the display above before writing another value
        evalDisplay.value = "0"; //Set display below to zero
        evaluated = false;
        activeDisplay.value = "";
    }

    if (currentScreen == "0"){ //If what is on the current active display is 0, then it is empty, ensure to add empty string first, so that the zero is not included in user entry
        activeDisplay.value = "";
    }

    activeDisplay.value += value; //Write value to screen
    activeDisplay.setSelectionRange(activeDisplay.value.length, activeDisplay.value.length);
    activeDisplay.focus(); //Focus the input so that it scrolls with the user's entry

    updateEvalDisplay(); //After every call of this function, ensure to update the display below with real-time, as-you-go evaluation result

}

function writeNumber(number){ //Special Function for writing numbers

    const currentScreen = activeDisplay.value; // Get current active screen
    const isAfterNumber = numbers.includes(currentScreen.charAt(currentScreen.length - 1)); //Check if last entry is a number
    const isAfterParentheses = currentScreen.charAt(currentScreen.length - 1) == ")"; //Check if last entry is a parentheses
    const isAfterPoint = currentScreen.charAt(currentScreen.length - 1) == "."; //Check if last entry is a decimal point
    const isAfterPercent = currentScreen.charAt(currentScreen.length - 1) == "%"; //Check if last entry is a percent sign

    if(isAfterNumber || isAfterPoint){ //If the last entry is a number or a decimal point, write the number to display as is
        writeToDisplay(number);
    }
    else{ //If the last entry is not a number or a decimal point...
        if(isAfterParentheses){ //If it is after a close parenthesis, write number as " x number"
            writeToDisplay(" × ");
            writeToDisplay(number);
        }
        else if(isAfterPercent){ //Otherwise, check if it is after a percent sign, if it is do nothing
            return;
        }
        else{ // If not any of the above cases, then the last entry is probably just another sign, just put a space and add the number
            writeToDisplay(" ");
            writeToDisplay(number);
        }
        
    }

}

function writeDecimal(sign){ //Special function for writing decimal point
    const currentScreen = activeDisplay.value;
    const isAfterBracket = currentScreen.charAt(currentScreen.length - 1) == ")"; //Check for special case where user is trying to write it after the closed bracket which is not in the signs set


    if(isAfterBracket){ //If it is after a closing bracket, do nothing
        return;
    }
    else{ //If it isn't just write it with writeSign function. writeSign function accounts for if it comes after another sign
        writeSign(sign);
    }
    
}

function writeSign(sign){

    const currentScreen = activeDisplay.value;
    const isAfterSign = signs.includes(currentScreen.charAt(currentScreen.length - 1)); //Is last entry a sign?
    const isScreenEmpty = currentScreen == "0"; //Is screen currently empty as in a 0?


    if(isScreenEmpty || evaluated){ //If screen is empty or the equals to sign was just pressed, then do not write just a sign on to the screen
        return;
    }

    else if(isAfterSign){ //If the sign comes after another sign on the screen, do not write it to display
        return;
    }
    else if(sign == "%" || sign == "."){ //If it doesn't come after another sign, then surely it comes after a number, so just write it as is
        writeToDisplay(sign);
    }
    else{ //If not any of the above cases, then it comes after a closing bracket, just write the sign with space in front of it
        writeToDisplay(" ");
        writeToDisplay(sign);
    }

}

function writeParentheses(){ //This function controls how parentheses are written

    const currentScreen = activeDisplay.value;
    const isAfterNumber = numbers.includes(currentScreen.charAt(currentScreen.length - 1));
    const isAfterTimes = currentScreen.charAt(currentScreen.length - 1) == "×";
    const isAfterPlus = currentScreen.charAt(currentScreen.length - 1) == "+";
    const isAfterMinus = currentScreen.charAt(currentScreen.length - 1) == "-";
    const isAfterDivide = currentScreen.charAt(currentScreen.length - 1) == "÷";
    const isAfterPercent = currentScreen.charAt(currentScreen.length - 1) == "%";
    const isScreenEmpty = currentScreen == "0";

    if(isScreenEmpty || evaluated){
        return;
    }
    else if (currentScreen.includes("(") && currentScreen.includes(")")){
        if(currentScreen.lastIndexOf(")") > currentScreen.lastIndexOf("(")){
            if(isAfterNumber || isAfterPercent){
                writeToDisplay(" x (");
            }
            else if(isAfterTimes){
                activeDisplay.value = activeDisplay.value.slice(0, currentScreen.length - 2);
                writeToDisplay(" × (");
            }
            else if(isAfterPlus){
                activeDisplay.value = activeDisplay.value.slice(0, currentScreen.length - 2);
                writeToDisplay(" + (");
            }
            else if(isAfterMinus){
                activeDisplay.value = activeDisplay.value.slice(0, currentScreen.length - 2);
                writeToDisplay(" - (");
            }
            else if(isAfterDivide){
                activeDisplay.value = activeDisplay.value.slice(0, currentScreen.length - 2);
                writeToDisplay(" ÷ (");
            }
            else{
                return;
            }
        }
        else{
            if(isAfterNumber){
                writeToDisplay(" )");
            }
            else{
                return;
            }
        }
    }
    else if (currentScreen.lastIndexOf("(") == -1){
        if(isAfterNumber || isAfterPercent){
            writeToDisplay(" × (");
        }
        else if(isAfterTimes){
            activeDisplay.value = activeDisplay.value.slice(0, currentScreen.length - 2);
            writeToDisplay(" × (");
        }
        else if(isAfterPlus){
            activeDisplay.value = activeDisplay.value.slice(0, currentScreen.length - 2);
            writeToDisplay(" + (");
        }
        else if(isAfterMinus){
            activeDisplay.value = activeDisplay.value.slice(0, currentScreen.length - 2);
            writeToDisplay(" - (");
        }
        else if(isAfterDivide){
            activeDisplay.value = activeDisplay.value.slice(0, currentScreen.length - 2);
            writeToDisplay(" ÷ (");
        }
        else{
            return;
        }
    }
    else if (currentScreen.lastIndexOf(")") == -1){
        if(isAfterNumber){
            writeToDisplay(" )");
        }
        else{
            return;
        }
    }

}

function convertDisplayString(currentScreen){

    return currentScreen.replaceAll("×", "*").replaceAll("÷", "/").replaceAll("%", " * 0.01");

    
}

function updateEvalDisplay(){

    const currentScreen = activeDisplay.value;
    const lastEntry = currentScreen.charAt(currentScreen.length - 1);

    if(numbers.includes(lastEntry) || lastEntry == "%" || ")"){
        console.log(currentScreen);
        const convertedContent = convertDisplayString(currentScreen);
        console.log(convertedContent);

        try{
            evalDisplay.value = eval(convertedContent);
        }

        catch(error){
            if(currentScreen.charAt(currentScreen.length - 2) == "."){
                activeDisplay.value = activeDisplay.value.slice(0, activeDisplay.value.lastIndexOf("."));
                console.log(error);
            }
                
        }
    }


}

function clearDisplay(){
    activeDisplay.value = "0";
    evalDisplay.value = "0";
}

function deleteBack(){

    const currentScreen = activeDisplay.value;


    const isAfterNumber = numbers.includes(currentScreen.charAt(currentScreen.length - 1));
    const isAfterSign = signs.includes(currentScreen.charAt(currentScreen.length - 1));
    const isAfterPoint = currentScreen.charAt(currentScreen.length - 1) == ".";

    if(currentScreen.length == 1){
        activeDisplay.value = "0";
        evalDisplay.value = "0";
    }
    else if(isAfterNumber){
        activeDisplay.value = activeDisplay.value.slice(0, currentScreen.length - 1);
    }
    else if(isAfterPoint){
        activeDisplay.value = activeDisplay.value.slice(0, currentScreen.length - 1);
    }
    else{
        activeDisplay.value = activeDisplay.value.slice(0, currentScreen.length - 2);
    }

    updateEvalDisplay();
}

function logEqualsTo(){

    activeDisplay.value = evalDisplay.value;
    evalDisplay.value = "0";
    evaluated = true;

}