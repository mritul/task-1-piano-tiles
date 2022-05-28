//Function that starts the game (wraps the entire code)
function startGame() {
  //Removing the keypress listener to start game or else game keeps starting on each press
  document.querySelector(".startBtn").style.display = "none";

  //Selecting all html elements and declaring global variables
  let boxes = document.querySelectorAll(".box");
  const roundField = document.querySelector(".round");
  const scoreField = document.querySelector(".score");
  const lossBeep = new Audio("loss-beep.mp3");
  const clickBeep = new Audio("click-beep.mp3");
  clickBeep.playbackRate = "3"; // Quick clicks won't miss on audio if the previous audio gets over sooner hence we increase the playback speed
  lossBeep.playbackRate = "2";
  var score = 0;
  var round = 1;
  var clicks = 0;
  //This array question indices is manipulated throughout the game (it is reset after each round and reused)
  let questions_indices = [];

  // ***HELPER FUNCTIONS***

  // Membership function
  const inArr = (n, arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == n) {
        return i + 1; // We return index + 1 to prevent 0 from being returned that will false in if cases
      }
    }
    return 0;
  };

  //***GAME FUNCTIONS***

  //Function that generates indices to be clicked every round
  const generateQuestions = (n) => {
    for (let i = 0; i < n; i++) {
      var random_index_to_push = Math.abs(Math.ceil(Math.random() * 36 - 1)); //Abs is because -0 is returned so we mod it
      if (inArr(random_index_to_push, questions_indices)) {
        n += 1; // Extending for loop if same number is generated again (We need an array of length of the current round)
      } else {
        questions_indices.push(random_index_to_push);
      }
    }
  };

  //Function that glows the tiles that were set by generateQuestions()
  const glowTiles = () => {
    for (let i = 0; i < questions_indices.length; i++) {
      setTimeout(() => {
        boxes[questions_indices[i]].style.backgroundColor = "aqua";
        //Now to make the glow off we nest a settimeout
        setTimeout(() => {
          boxes[questions_indices[i]].style.backgroundColor = "grey";
        }, 1200);
      }, 1200 * i); // 1200*i is to prevent all tiles from glowing at the same time
    }

    // We now return a promise after the tiles have finished glowing
    //The time taken for all tiles to glow is 1200*question_indices.length so we use a settimeout for resolving the promise
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1200 * questions_indices.length);
    });
  };

  //After tiles have glown we let the user select the tiles and reload if user makes mistake and go to next round if user makes it past the entire round
  const tilesSelect = () => {
    //We wrap the entire body of the function so that we can call resolve in the place where we want to exit the function
    return new Promise((resolve, reject) => {
      boxes.forEach((box) => {
        // Reverting pointer events to all which is initially none from css as we don't want the user to click when glowing takes place
        box.style.pointerEvents = "all";
        box.style.cursor = "pointer";
        box.addEventListener("click", (e) => {
          clicks += 1;
          clickBeep.play();
          // If the box user clicks is present in the question array generated then splice it from the question indices or else display loss message and reload the page as user clicks the wrong tile
          // The only difference in hacker mode is one extra 'and' condition where the box user clicks should be the first element of question indices(first elements keep updating as we splice so we can use the index 0 each time)
          if (
            inArr(e.target.getAttribute("data-item"), questions_indices) &&
            e.target.getAttribute("data-item") == questions_indices[0]
          ) {
            questions_indices.splice(
              inArr(e.target.getAttribute("data-item"), questions_indices) - 1,
              1
            );
            e.target.style.pointerEvents = "none";
          } else {
            lossBeep.play();
            window.alert(
              "Oops! You chose a wrong tile. Your score is " + score
            );
            location.reload();
          }
          //Checking if we can move to next round
          if (clicks == round) {
            moveToNextRound();
            //We end the function here and return a promise to let the program know we moved to the next round
            resolve();
          }
        });
      });
    });
  };

  //Function to make resets and move to next round
  const moveToNextRound = () => {
    score += 1;
    round += 1;
    roundField.textContent = round;
    scoreField.textContent = score;
    clicks = 0;
    //removeEventListener does not work for some reason so we use alternatice cloning method to remove the event listeners
    // REMOVING EVENT LISTENER IS HIGHLY IMPORTANT OR ELSE WHEN WE MOVE TO THE NEXT ROUND THE EVENT LISTENERS FROM PREVIOUS ROUNDS PERSIST AND BEHAVIOUR IS HIGHLY DEVIATED
    boxes.forEach((box) => {
      box.style.pointerEvents = "none"; // So that in next round, user can't click while tiles glow
      var old_element = box;
      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
    });
    boxes = document.querySelectorAll(".box");
    //We've redefined boxes after replacing.This step is important after using clone

    // questions_indices = []; // Getting the array reset for next round
  };

  //Main code using the functions
  const main = async () => {
    while (round <= 36) {
      generateQuestions(round); //The number indices generated is the current round number
      await glowTiles();
      await tilesSelect();
    }
    window.alert("Yay! You won the game");
    location.reload();
  };
  main();
}

document.querySelector(".startBtn").addEventListener("click", startGame);
