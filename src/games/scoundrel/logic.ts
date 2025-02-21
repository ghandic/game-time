import { CardType, CardValue, Deck, Suit } from "./types";

// Utility: shuffle an array in-place using Fisher-Yates algorithm
export function shuffle(array: Deck) {
    let currentIndex = array.length,
      randomIndex
  
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
        ;[array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ]
    }
    return array
  }
  
// Create a new deck based on your rules.
export function createDeck(): Deck {
const deck: Deck = []
let idCounter = 0
const faceCards = ['J', 'Q', 'K', 'Ace']
const suitsMonsters: Suit[] = ['♠', '♣']
// Monster cards
suitsMonsters.forEach((suit) => {
    for (let i = 2; i <= 10; i++) {
    deck.push({
        id: idCounter++,
        suit,
        value: i.toString() as CardValue,
        numericValue: i,
        type: 'monster',
    })
    }
    faceCards.forEach((card) => {
    const numericValue = card === 'J' ? 11 : card === 'Q' ? 12 : card === 'K' ? 13 : 14
    deck.push({
        id: idCounter++,
        suit,
        value: card as CardValue,
        numericValue,
        type: 'monster',
    })
    })
})

// Hearts and Diamonds (only 2-10)
const otherSuits: { suit: Suit; type: CardType }[] = [
    { suit: '♥', type: 'potion' },
    { suit: '♦', type: 'weapon' },
]
otherSuits.forEach(({ suit, type }) => {
    for (let i = 2; i <= 10; i++) {
    deck.push({
        id: idCounter++,
        suit,
        value: i.toString() as CardValue,
        numericValue: i,
        type,
    })
    }
})

return shuffle(deck)
}
