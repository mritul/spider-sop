window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    // register service worker
    navigator.serviceWorker.register("service-worker.js");
  }
  const blanksHolder = document.querySelector(".blanks-holder");
  const form = document.querySelector("form");
  const letterInput = document.querySelector("form input");
  const buttons = document.querySelectorAll(".btnPanel button");
  const hangman = document.querySelector(".hangman");
  const modal = document.querySelector("dialog");
  const state = document.querySelector(".state");
  const playAgainBtn = document.querySelector("dialog button");
  const score = document.querySelector(".score");
  const scoreAtb = document.querySelector(".score-atb"); // All time best
  const wrapper = document.querySelector(".wrapper");

  //Function for fetching data
  const fetchData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data[0];
  };

  const start = async () => {
    const word = await fetchData("https://random-word-api.herokuapp.com/word");
    const wordContainer = document.querySelector(".word"); // The span holding word name in modal
    const arr = []; // Global array that holds all guessed values. We use this array to check for repetetive guesses

    //Setting up variable in localStorage
    if (!localStorage.getItem("allTimeBest")) {
      localStorage.setItem("allTimeBest", 0);
    }

    //lengthLeft is the global variable to check for win after each submit/button press. If it becomes 0 it means the player has won
    let lengthLeft = word.length;
    //lives is the global variable to check for loss at each amputation. If it becomes 0 it means the player loses
    let lives = 6;

    // Funtionality to input field
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // We wrap the entire code under an if to prevent repetetive guessing, i.e guessing a letter that has already been tried through button or input
      // We see if the user guess is not in the global array(no repetition of guess) and only then execute the rest of the code inside the if statement
      if (!inArr(arr, letterInput.value.toLowerCase())) {
        //Converting the input to lowercase as checkletter() and expose use lowercase letters for comparison in string "word" and data-letter
        if (checkLetter(letterInput.value.toLowerCase())) {
          expose(letterInput.value.toLowerCase());
        } else {
          amputate();
        }
        //Updating the modal data on each submission
        updateModal();

        //Pushing the guess into global array
        arr.push(letterInput.value.toLowerCase());

        //Deactivating the button that carries the same letter as the guess through input or else repetitive guesses could be made
        buttons.forEach((button) => {
          if (
            button.innerHTML.toLowerCase() === letterInput.value.toLowerCase()
          ) {
            deactivate(button);
          }
        });
      }
      letterInput.value = "";
    });

    // Functionality to buttons
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        // !! CONVERT THE INNERHTML TO LOWERCASE AS CHECKLETTER CHECKS THE  STRING "word"  WHICH HAS LOWERCASE LETTERS AND expose() CHECKS THE DATA-LETTER THAT HAS LOWERCASE LETTERS
        if (checkLetter(button.innerHTML.toLowerCase())) {
          expose(button.innerHTML.toLowerCase());
        } else {
          amputate();
        }
        updateModal();
        // checkForWin();
        arr.push(button.innerHTML.toLowerCase());
        deactivate(button);
      });
    });

    playAgainBtn.addEventListener("click", () => {
      location.reload();
    });

    //Setting up  the blanks according to the word length
    const setup = () => {
      for (let i = 0; i < word.length; i++) {
        const blank = document.createElement("div");
        blank.classList.add("blank");
        // We create a h1 inside of the div because we have to hide and display the innerText
        const textElement = document.createElement("h1");
        textElement.classList.add("text");
        const text = document.createTextNode(word[i].toUpperCase()); //Putting the letters of the word into the h1 inside each blank
        textElement.appendChild(text);
        blank.appendChild(textElement);
        blank.setAttribute("data-letter", word[i]); // Setting data attributes to use inside of javascript code to check
        blanksHolder.appendChild(blank);
      }
    };

    // Function to check if the letter chosen is in the question word
    const checkLetter = (c) => {
      let flag = 0;
      const arr = [];
      for (let i of word) {
        if (i == c) {
          flag = 1;
          break;
        }
      }
      return flag;
    };

    //Function to expose the correct letters
    const expose = (c) => {
      blanks.forEach((blank) => {
        if (blank.getAttribute("data-letter") == c) {
          // childNodes of blank is the <h1> tag containing the letter text inside a single element array so childNodes[0] returns the <h1> element which we can then give display block(we initially hide it in css)
          blank.childNodes[0].style.display = "block";
          lengthLeft -= 1; // Every exposed letter means lengthLeft is reduced by 1. We can use this for score calculation and finding if game is over
          // Checking for win after each submission
          checkForWin();
        }
      });
    };

    //Function to amputate hangman after a wrong guess
    const amputate = () => {
      lives -= 1;
      // We've named the svg files such that when lives lowers, the svg to display
      hangman.src = `./imgs/${lives}.svg`;
      checkForLoss();
    };

    //Function to check loss on every amputation
    const checkForLoss = () => {
      // We update the localStorage on game over i.e before the modal displays
      if (lives == 0) {
        if (lives > localStorage.getItem("allTimeBest")) {
          localStorage.setItem("allTimeBest", lives);
        }
        showmodal("lose !", "red");
      }
    };

    //Function to check for win and display modal if lengthLeft is 0 i.e game is over
    const checkForWin = () => {
      // We update the localStorage on game over i.e before the modal displays
      if (lengthLeft == 0) {
        if (lives > localStorage.getItem("allTimeBest")) {
          localStorage.setItem("allTimeBest", lives);
        }
        showmodal("win !", "green");
      }
    };

    // Function to update modal before displaying it (like score and allTimeBest)
    const updateModal = () => {
      score.textContent = lives;
      // If current game's score is greater than the all time best in localStorage, then we set alltimebest in modal as lives which is the current alltimebest
      scoreAtb.textContent = localStorage.getItem("allTimeBest");
      wordContainer.textContent = word;
    };

    //Function to show modal and we pass parameters to display win and loss accordingly
    const showmodal = (s, colour) => {
      state.textContent = s;
      state.style.color = colour;
      wordContainer.style.color = colour;
      modal.style.display = "block";
      wrapper.style.backgroundColor = "rgba(0,0,0,0.5)";
    };

    //Function to deactivate the buttons once clicked
    const deactivate = (btn) => {
      btn.style.pointerEvents = "none";
      btn.style.opacity = 0;
    };

    // Membership function
    const inArr = (arr, c) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == c) {
          return 1;
        }
        return 0;
      }
    };

    setup();
    // WE HAVE TO SELECT THE HTML ELEMENTS AFTER SETUP FUNCTION AS THE BLANKS ARE GETTING CREATED INSIDE OF THE SETUP FUNCTION
    const blanks = document.querySelectorAll(".blank");
  };

  // The entire game is wrapped inside a function called start because we fetch through an async function
  start();
});
