# The flow of code is as follows

- First the blanks are setup according to the length of the word to be guessed

- And then, when a user makes a submission of a guess (through virtual keyboard or text), if the guess of letter is correct, the letter is exposed through a custom function

- checkLetter() is a function that takes in a character and checks if it is present in the word to be guessed. So on input submission/button click, if the letter is present in word, expose() is executed or else amputate() is executed

- expose() is a function that traverses the blanks and if the data-letter matches the letter the user guessed, then display of the h1 inside the div is made block(it is none by default).The variable lengthLeft is reduced by one on each letter expose that can be used later for checking for win

- amputate() is a function that executes when the user makes a wrong guess and this function changes the src of the image through the number of lives which is reduced by 1 on the function start.

- checkForWin() is a function that is run on each submission that checks the lengthLeft to guess and if it is 0 it means the user wins. If lives becomes 0 then its a loss

- To avoid repetetive guesses in all ways(button->input,input->input,input->button,button->button), we use 2 ways:

        - When user inputs a value through the input box, the button corresponding to that letter is deactivated.

        - When user inputs a value through a button , that button is deactivated

        - Finally, to make sure that the letters that are already guessed through input/button don't be valid on typing it inside the input box again, a global array is maintained that has the guesses pushed into on each guess, be it through text or button and the function inside form submit event listener executes only if the guess is not in the array already so that same letter does not count twice.

</br>

# Scoring system

The score is decided based upon the number of lives left
