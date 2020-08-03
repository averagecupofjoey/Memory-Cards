const cardsContainer = document.getElementById("cards-container");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const currentEl = document.getElementById("current");
const showBtn = document.getElementById("show");
const hideBtn = document.getElementById("hide");
const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const addCardBtn = document.getElementById("add-card");
const clearBtn = document.getElementById("clear");
const addContainer = document.getElementById("add-container");
const deleteBtn = document.getElementById("deleteCard");
const learnBtn = document.getElementById("learnCard");
const showLearnBtn = document.getElementById("showLearned");
const showUnlearnedBtn = document.getElementById("showUnlearned");

// Keep track of current card
let currentActiveCard = 0;

// Store DOM cards
let cardsEl = [];

// Store unlearnedcard data
let cardsData = getCardsData();

// Store learned data
let learnedCardsData = getLearnedCardsData();

// const cardsData = [
//   {
//     question: "What must a variable begin with?",
//     answer: "A letter, $ or _",
//   },
//   {
//     question: "What is a variable?",
//     answer: "Container for a piece of data",
//   },
//   {
//     question: "Example of Case Sensitive Variable",
//     answer: "thisIsAVariable",
//   },
// ];

// Create unlearned cards
function createCards() {
  cardsData.forEach((data, index) => createCard(data, index));
}

// Create learned cards
function createLearnedCards() {
  learnedCardsData.forEach((data, index) => createCard(data, index));
}

// Create a single card in DOM
function createCard(data, index) {
  const card = document.createElement("div");
  card.classList.add("card");

  if (index === 0) {
    card.classList.add("active");
  }

  card.innerHTML = `
  <div class="inner-card">
  <div class="inner-card-front">
    <p>
      ${data.question}
    </p>
  </div>
  <div class="inner-card-back">
    <p>
      ${data.answer}
    </p>
  </div>
</div>
`;

  card.addEventListener("click", () => card.classList.toggle("show-answer"));

  // Add to DOM cards
  cardsEl.push(card);

  cardsContainer.appendChild(card);

  updateCurrentText();
}

// Show number of cards
function updateCurrentText() {
  currentEl.innerText = `${currentActiveCard + 1}/${cardsEl.length}`;
}

// Get unlearned cards from local storage
function getCardsData() {
  const cards = JSON.parse(localStorage.getItem("unlearnedCards"));
  return cards === null ? [] : cards;
}

// Get LEARNED cards from local storage
function getLearnedCardsData() {
  const cards = JSON.parse(localStorage.getItem("learnedCards"));
  return cards === null ? [] : cards;
}

// Add unlearnedcard to local storage
function setCardsData(cards) {
  localStorage.setItem("unlearnedCards", JSON.stringify(cards));
  window.location.reload();
}

// Add learned card to local storage
function setLearnedData(cards) {
  localStorage.setItem("learnedCards", JSON.stringify(cards));
  //  window.location.reload();  the delete cards function will reload window
}

createCards();

// Event listeners

// Next button
nextBtn.addEventListener("click", () => {
  cardsEl[currentActiveCard].className = "card left";

  currentActiveCard = currentActiveCard + 1;

  if (currentActiveCard > cardsEl.length - 1) {
    currentActiveCard = cardsEl.length - 1;
  }

  cardsEl[currentActiveCard].className = "card active";

  updateCurrentText();
});

// Prev button
prevBtn.addEventListener("click", () => {
  cardsEl[currentActiveCard].className = "card right";

  currentActiveCard = currentActiveCard - 1;

  if (currentActiveCard < 0) {
    currentActiveCard = 0;
  }

  cardsEl[currentActiveCard].className = "card active";

  updateCurrentText();
});

// Show the add container
showBtn.addEventListener("click", () => addContainer.classList.add("show"));

// Hide the add container
hideBtn.addEventListener("click", () => addContainer.classList.remove("show"));

// Add a new card
addCardBtn.addEventListener("click", () => {
  const question = questionEl.value;
  const answer = answerEl.value;

  if (question.trim() && answer.trim) {
    const newCard = { question, answer };

    createCard(newCard);

    questionEl.value = "";
    answerEl.value = "";

    addContainer.classList.remove("show");

    cardsData.push(newCard);
    setCardsData(cardsData);
  }
});

//clear cards button
clearBtn.addEventListener("click", () => {
  localStorage.clear();
  cardsContainer.innerHTML = "";
  window.location.reload();
});

//delete card button
deleteBtn.addEventListener("click", () => {
  deleteCurrentCard();
});

// adjustments

// Delete current card from local storage
function deleteCurrentCard() {
  cardsData.splice(currentActiveCard, 1);
  setCardsData(cardsData);
}

// Move cards to learned deck
function learnCurrentCard() {
  // store current card
  let learnedCard = cardsData.slice(currentActiveCard, currentActiveCard + 1);
  learnedCardsData.push(learnedCard[0]);
  // set in learned local storage
  setLearnedData(learnedCardsData);

  // delete in unlearned
  deleteCurrentCard();
}

// Learn button event listener
learnBtn.addEventListener("click", () => learnCurrentCard());

// Show learned cards event listener
showLearnBtn.addEventListener("click", () => {
  cardsEl = [];
  cardsContainer.innerHTML = "";
  createLearnedCards();
  currentActiveCard = 0;
  updateCurrentText();
});

// Show unlearned cards event listener
showUnlearnedBtn.addEventListener("click", () => {
  cardsEl = [];
  cardsContainer.innerHTML = "";
  createCards();
  currentActiveCard = 0;
  updateCurrentText();
});
