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
// const words = ["pack", "stubborn", "dentist", "stool"]; //Max limit is 8 Min is 4
// const word = words[Math.floor(Math.random() * words.length)]; // Simulating a random word
const word = "abba";
//Setting up variable in localStorage
if (!localStorage.getItem("allTimeBest")) {
  localStorage.setItem("allTimeBest", 0);
}

//lengthLeft is the global variable to check for win after each submit/button press. If it becomes 0 it means the player has won
let lengthLeft = word.length;
let lives = 6;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(letterInput.value);
  if (checkLetter(letterInput.value)) {
    expose(letterInput.value);
  } else {
    amputate();
  }
  //Updating the modal data on each submission
  updateModal();

  // Checking for win after each submission
  checkForWin();
  letterInput.value = "";
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
    const text = document.createTextNode(word[i].toUpperCase());
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
    }
  });
};

//Function to amputate hangman after a wrong guess
const amputate = () => {
  lives -= 1;
  console.log(lives);
  // We've named the svg files such that when lives lowers, the svg to display
  hangman.src = `./imgs/${lives}.svg`;
  checkForLoss();
};

const checkForLoss = () => {
  // We update the localStorage on game over i.e before the modal displays
  if (lives == 0) {
    if (lives > localStorage.getItem("allTimeBest")) {
      localStorage.setItem("allTimeBest", lives);
    }
    state.textContent = "lose";
    state.style.color = "red";
    modal.style.display = "block";
    wrapper.style.backgroundColor = "rgba(0,0,0,0.5)";
  }
};

//Function to check for win and display modal if lengthLeft is 0 i.e game is over
const checkForWin = () => {
  // We update the localStorage on game over i.e before the modal displays
  if (lengthLeft == 0) {
    if (lives > localStorage.getItem("allTimeBest")) {
      localStorage.setItem("allTimeBest", lives);
    }
    state.textContent = "win !";
    state.style.color = "green";
    modal.style.display = "block";
    wrapper.style.backgroundColor = "rgba(0,0,0,0.5)";
  }
};

// Function to update modal before displaying it (like score and allTimeBest)
const updateModal = () => {
  score.textContent = lives;
  // If current game's score is greater than the all time best in localStorage, then we set alltimebest in modal as lives which is the current alltimebest
  scoreAtb.textContent =
    lives > localStorage.getItem("allTimeBest")
      ? lives
      : localStorage.getItem("allTimeBest");
};

setup();
// WE HAVE TO SELECT THE HTML ELEMENTS AFTER SETUP FUNCTION AS THE BLANKS ARE GETTING CREATED INSIDE OF THE SETUP FUNCTION
const blanks = document.querySelectorAll(".blank");
