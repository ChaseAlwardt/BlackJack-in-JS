let deck = [];
let playerHand = [];
let dealerHand = [];

const dealerDiv = document.getElementById("dealer-hand");
const playerDiv = document.getElementById("player-hand");
const dealerScoreEl = document.getElementById("dealer-score");
const playerScoreEl = document.getElementById("player-score");
const messageEl = document.getElementById("message");

const dealbtn = document.getElementById("deal-btn");
const hitbtn = document.getElementById("hit-btn");
const standbtn = document.getElementById("stand-btn");
dealbtn.addEventListener("click", startGame);
hitbtn.addEventListener("click", playerHit);
standbtn.addEventListener("click", dealerTurn);

function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    deck = [];
    for (let s of suits) {
        for (let v of values) {
            deck.push({ suit: s, value: v });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function getCardValue(card) {
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    if (card.value === 'A') return 11; 
    return parseInt(card.value);
}

function calculateHandValue(hand) {
    let total = 0;
    let aces = 0;
    for (let card of hand) {
        total += getCardValue(card);
        if (card.value === 'A') aces++;
    }
    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }
    return total;
}

function renderHand(hand, div) {
    div.innerHTML = '';
    for (let card of hand){
        const cardEl = document.createElement("div");
        cardEl.classList.add("card");
        cardEl.innerText = `${card.value}\n${card.suit}`;
        if(card.suit === '♥' || card.suit === '♦') cardEl.style.color = "red";
        div.appendChild(cardEl)
    }
}

function renderHands(showDealer = false) {
    renderHand(playerHand, playerDiv);
    renderHand(showDealer ? dealerHand : [dealerHand[0], { value: '?', suit: '?' }], dealerDiv);

    playerScoreEl.textContent = `Score: ${calculateHandValue(playerHand)}`;
    dealerScoreEl.textContent = showDealer ? `Score: ${calculateHandValue(dealerHand)}` : "Score: ?";
}

function startGame(){
    createDeck();
    shuffleDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];

    renderHands();
    messageEl.textContent = "";

    dealbtn.disabled = true;
    hitbtn.disabled = false;
    standbtn.disabled = false;
}

function playerHit(){
    playerHand.push(deck.pop());
    renderHands();

    if(calculateHandValue(playerHand) > 21) {
        endGame("You Bust, Dealer Wins");
    }
}

function dealerTurn(){
    hitbtn.disabled = true;
    standbtn.disabled = true;

    renderHands(true);
    
    while(calculateHandValue(dealerHand) < 17){
        dealerHand.push(deck.pop());
        renderHands(true);
    }

    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);

    if(dealerScore > 21) {
        endGame("Dealer busts, You Win");
    }
    else if (playerScore > dealerScore) {
        endGame("You Win");
    }
    else if (dealerScore > playerScore) {
        endGame("Dealer Wins");
    }
    else{
        endGame("Its a push");
    }
}

function endGame(msg) {
    messageEl.textContent = msg;
    renderHands(true);
    dealbtn.disabled = false;
    hitbtn.disabled = true;
    standbtn.disabled = true;
}