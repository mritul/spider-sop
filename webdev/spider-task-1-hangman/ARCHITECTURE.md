# The flow of code is as follows

- First the blanks are setup according to the length of the word to be guessed

- And then, when a user makes a submission of a guess (through virtual keyboard or text), if the guess of letter is correct, the letter is exposed through a custom function

- checkLetter() is a function that takes in a character and checks if it is present in the word to be guessed. So on input submission/button click, if the letter is present in word, expose() is executed or else amputate() is executed

- expose() is a function that traverses the blanks and if the data-letter matches the letter the user guessed, then display of the h1 inside the div is made block(it is none by default).The variable lengthLeft is reduced by one on each letter expose that can be used later for checking for win

- amputate() is a function that executes when the user makes a wrong guess and this function changes the src of the image through the number of lives which is reduced by 1 on the function start.

- checkForWin() is a function that is run on each submission that checks the lengthLeft to guess and if it is 0 it means the user wins.

</br>

# Scoring system

The score is decided based upon the number of lives left
