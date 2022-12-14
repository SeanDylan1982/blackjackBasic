let dealerFirstCard = 0;
let dealerSecondCard = 0;
let dealerTotal = 0;
let playerFirstCard = 0;
let playerSecondCard = 0;
let playerTotal = 0;
let newCard = 0;
let dealerHand = document.getElementById("dealer-hand");
let playerHand = document.getElementById("player-hand");
let dealerTotalDisplay = document.getElementById("dealer-total");
let playerTotalDisplay = document.getElementById("player-total");
let dealBtn = document.getElementById("deal");
let hitBtn = document.getElementById("hit");
let standBtn = document.getElementById("stand");
let result = document.getElementById("result");
let dealerResult = document.getElementById("dealer-result");
let winnerResult = document.getElementById("winner-result");
let dealerWindow = document.getElementById("dealer");
let playerWindow = document.getElementById("player");

playerWindow.style.justifyContent = "center";
dealerWindow.style.justifyContent = "center";

clear();

dealerWindow.style.backgroundColor = "#f1f1f1";
dealerWindow.style.color = "#1a1a1a";
playerWindow.style.backgroundColor = "#f1f1f1";
playerWindow.style.color = "#1a1a1a";

function addEvents() {
  dealBtn.addEventListener("click", deal);
  standBtn.addEventListener("click", playerStand);
  hitBtn.addEventListener("click", dealNewCard);
}
addEvents();

function removeEvents() {
  hitBtn.removeEventListener("click", dealNewCard);
  standBtn.removeEventListener("click", playerStand);
}

function winnerCheck() {
  if ( dealerTotal > playerTotal && dealerTotal <= 21 ) {
    winnerResult.innerHTML = "Dealer Wins!";
    result.innerHTML = "";
    dealerResult.innerHTML = "";
    dealerWindow.style.backgroundColor = "green";
    playerWindow.style.backgroundColor = "red";
    dealerWindow.style.color = "white";
    playerWindow.style.color = "white";
    removeEvents();
  } else if ( playerTotal > dealerTotal && playerTotal <= 21 ) {
    winnerResult.innerHTML = "Player Wins!";
    result.innerHTML = "";
    dealerResult.innerHTML = "";
    playerWindow.style.backgroundColor = "green";
    dealerWindow.style.backgroundColor = "red";
    dealerWindow.style.color = "white";
    playerWindow.style.color = "white";
    removeEvents();
  } else if ( dealerTotal === playerTotal && dealerTotal <= 21 && playerTotal <= 21) {
    winnerResult.innerHTML = "Push!";
    result.innerHTML = "";
    dealerResult.innerHTML = "";
    playerWindow.style.backgroundColor = "yellow";
    dealerWindow.style.backgroundColor = "yellow";
    playerWindow.style.color = "#1a1a1a";
    dealerWindow.style.color = "#1a1a1a";
    removeEvents();
  } else {
    addEvents();
    colorPicker();
    playerWindow.style.backgroundColor = "#f1f1f1";
    dealerWindow.style.backgroundColor = "#f1f1f1";
    playerWindow.style.color = "#1a1a1a";
    dealerWindow.style.color = "#1a1a1a";
  }
  removeEvents();
}
winnerCheck();

function dealerCheck() {
  if ( dealerTotal > playerTotal && dealerTotal <= 21 ) {
    dealerResult.innerHTML = "Dealer Wins!";
    result.innerHTML = "";
    winnerResult.innerHTML = "";
    dealerWindow.style.backgroundColor = "green";
    playerWindow.style.backgroundColor = "red";
    dealerWindow.style.color = "white";
    playerWindow.style.color = "white";
    removeEvents();
  } else if ( playerTotal > dealerTotal && playerTotal <= 21 ) {
    dealerResult.innerHTML = "Player Wins!";
    result.innerHTML = "";
    winnerResult.innerHTML = "";
    playerWindow.style.backgroundColor = "green";
    dealerWindow.style.backgroundColor = "red";
    dealerWindow.style.color = "white";
    playerWindow.style.color = "white";
    removeEvents();
  } else if ( dealerTotal === playerTotal && dealerTotal > playerTotal && dealerTotal <= 21 && playerTotal > dealerTotal && playerTotal <= 21) {
    dealerResult.innerHTML = "Push!";
    result.innerHTML = "";
    winnerResult.innerHTML = "";
    playerWindow.style.backgroundColor = "yellow";
    dealerWindow.style.backgroundColor = "yellow";
    playerWindow.style.color = "#1a1a1a";
    dealerWindow.style.color = "#1a1a1a";
    removeEvents();
  }
}

function playerCheck() {
  if (playerTotal < 21) {
    result.textContent = "Hit or Stand?";
    winnerResult.innerHTML = "";
    dealerResult.innerHTML = "";
  } else if (playerTotal === 21) {
    result.textContent = "BLACKJACK!!! You Win!";
    winnerResult.innerHTML = "";
    dealerResult.innerHTML = "";
    playerWindow.style.backgroundColor = "green";
    dealerWindow.style.backgroundColor = "red";
    dealerWindow.style.color = "white";
    playerWindow.style.color = "white";
    removeEvents();
  } else {
    result.textContent = "Bust! You Lose!";
    winnerResult.innerHTML = "";
    dealerResult.innerHTML = "";
    dealerWindow.style.backgroundColor = "green";
    playerWindow.style.backgroundColor = "red";
    dealerWindow.style.color = "white";
    playerWindow.style.color = "white";
    removeEvents();
  }
}

function clear() {
  addEvents();
  colorPicker();
  result.innerHTML = "Deal...";
  dealerResult.innerHTML = "";
  winnerResult.innerHTML = "";
  dealerWindow.style.backgroundColor = "#f1f1f1";
  dealerWindow.style.color = "#1a1a1a";
  playerWindow.style.backgroundColor = "#f1f1f1";
  playerWindow.style.color = "#1a1a1a";
  }
clear();

function dealer() {
  dealerFirstCard = Math.floor(Math.random() * 10) + 2;
  dealerSecondCard = Math.floor(Math.random() * 10) + 2;
  dealerHand.textContent = dealerFirstCard;
  dealerTotal = dealerFirstCard;
  dealerTotalDisplay.innerText = "Total: " + dealerTotal;
}

function player() {
  playerFirstCard = Math.floor(Math.random() * 10) + 2;
  playerSecondCard = Math.floor(Math.random() * 10) + 2;
  playerHand.textContent = playerFirstCard + " - ";
  playerHand.textContent += " " + playerSecondCard;
  playerTotal = playerFirstCard + playerSecondCard;
  playerTotalDisplay.innerText = "Total: " + playerTotal;
}

function dealNewCard() {
  newCard = Math.floor(Math.random() * 10) + 2;
  playerTotal += newCard;
  playerHand.textContent += " - " + newCard;
  playerTotalDisplay.innerText = "Total: " + playerTotal;
  playerCheck();
  addEvents();
}

function deal() {
  clear();
  dealer();
  player();
  playerCheck();
  addEvents();
}

function dealerHit() {
  dealerCheck();
  if ( dealerTotal <= 17 ) {
    removeEvents();
    newCard = Math.floor(Math.random() * 10) + 2;
    dealerTotal += newCard;
    dealerHand.textContent += " - " + newCard;
    dealerTotalDisplay.innerText = "Total: " + dealerTotal;
  } else if (dealerTotal >= 17 && dealerTotal <=21) {
    dealerResult.textContent = "Dealer Stands!";
    playerWindow.style.backgroundColor = "green";
    dealerWindow.style.backgroundColor = "red";
    dealerWindow.style.color = "white";
    playerWindow.style.color = "white";
    removeEvents();
    result.innerHTML = "";
    winnerResult.innerHTML = "";
  } else if (dealerTotal === 21) {
    dealerResult.textContent = "Dealer BLACKJACK!!! You Lose!";
    removeEvents();
    result.innerHTML = "";
    winnerResult.innerHTML = "";
    dealerWindow.style.backgroundColor = "green";
    playerWindow.style.backgroundColor = "red";
    dealerWindow.style.color = "white";
    playerWindow.style.color = "white";
    winnerCheck();
  } else if (dealerTotal > 21 ) {
    dealerResult.textContent = "Dealer Bust! You Win!";
    playerWindow.style.backgroundColor = "green";
    dealerWindow.style.backgroundColor = "red";
    dealerWindow.style.color = "white";
    playerWindow.style.color = "white";
    result.innerHTML = "";
    winnerResult.innerHTML = "";
    removeEvents();
  }
  winnerCheck();
}

function playerStand() {
  result.innerText = "Player Stands!";
  dealerResult.innerHTML = "";
  winnerResult.innerHTML = "";
  dealerHand.textContent = dealerFirstCard + " - ";
  dealerHand.textContent += " " + dealerSecondCard;
  dealerTotal = dealerFirstCard + dealerSecondCard;
  dealerTotalDisplay.innerText = "Total: " + dealerTotal;

  for ( let i = 0; i < 10; i++) {
    dealerHit();
  }
  dealerCheck();
  winnerCheck();
  removeEvents();
};
standBtn.addEventListener("click", playerStand);
clear();