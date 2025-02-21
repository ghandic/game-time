import React, { useEffect, useState } from 'react'

type Suit = '♠' | '♣' | '♥' | '♦'
type CardType = 'monster' | 'potion' | 'weapon'
type CardValue = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'Ace'
type Card = { id: number, suit: Suit, value: CardValue, numericValue: number, type: CardType }
type Deck = Card[]

type Weapon = { value: number, lastUsedAttack: number | null }

// Utility: shuffle an array in-place using Fisher-Yates algorithm
function shuffle(array: Deck) {
  let currentIndex = array.length, randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
      ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
  return array
}


// Create a new deck based on your rules:
// • Spades (♠) & Clubs (♣) are monsters (cards 2–10, J, Q, K, Ace)
// • Hearts (♥) are health potions (only 2–10)
// • Diamonds (♦) are weapon cards (only 2–10)
function createDeck() {
  const deck: Deck = []
  let idCounter = 0
  const faceCards = ['J', 'Q', 'K', 'Ace']
  const suitsMonsters: Suit[] = ['♠', '♣']
  // Monster cards
  suitsMonsters.forEach(suit => {
    // Numbers 2-10
    for (let i = 2; i <= 10; i++) {
      deck.push({ id: idCounter++, suit, value: i.toString() as CardValue, numericValue: i, type: 'monster' })
    }
    // Face cards with assigned values: J=11, Q=12, K=13, Ace=14
    faceCards.forEach(card => {
      const numericValue = card === 'J' ? 11 : card === 'Q' ? 12 : card === 'K' ? 13 : 14
      deck.push({ id: idCounter++, suit, value: card as CardValue, numericValue, type: 'monster' })
    })
  })

  // Hearts and Diamonds (only 2-10)
  const otherSuits: { suit: Suit, type: CardType }[] = [
    { suit: '♥', type: 'potion' },
    { suit: '♦', type: 'weapon' }
  ]
  otherSuits.forEach(({ suit, type }) => {
    for (let i = 2; i <= 10; i++) {
      deck.push({ id: idCounter++, suit, value: i.toString() as CardValue, numericValue: i, type })
    }
  })

  return shuffle(deck)
}

type CardProps = { card: Card, onDrink: () => void, onEquip: () => void, onFightBareHands: () => void, onFightWithWeapon: () => void, canFightWithWeapon: boolean | null }

// A card component showing its suit, value, and available action buttons.
const CardComponent = ({ card, onDrink, onEquip, onFightBareHands, onFightWithWeapon, canFightWithWeapon }: CardProps) => {
  return (
    <div className="bg-white rounded shadow p-4 m-2">
      <div className="text-2xl font-bold" style={{ color: ['♦', '♥'].includes(card.suit) ? 'red' : 'black' }}>
        {card.suit} {card.value}
      </div>
      <div className="mt-2 space-x-2">
        {card.type === 'potion' && (
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={onDrink}>
            Drink
          </button>
        )}
        {card.type === 'weapon' && (
          <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={onEquip}>
            Equip
          </button>
        )}
        {card.type === 'monster' && (
          <>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={onFightBareHands}
            >
              Fight (Bare Hands)
            </button>
            <button
              className="bg-purple-500 text-white px-3 py-1 rounded"
              onClick={onFightWithWeapon}
              disabled={!canFightWithWeapon}
            >
              Fight (Weapon)
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function App() {

  // Game states
  const [deck, setDeck] = useState<Deck>([])
  const [room, setRoom] = useState<Deck>([])
  const [health, setHealth] = useState<number>(20)
  const [equippedWeapon, setEquippedWeapon] = useState<Weapon | null>(null)
  const [ranAwayLastRoom, setRanAwayLastRoom] = useState<boolean>(false)
  const [gameOver, setGameOver] = useState<boolean>(false)


  // On mount, initialize the deck and draw the first room.
  useEffect(() => {
    const newDeck = createDeck()
    setDeck(newDeck)
    drawInitialRoom(newDeck)
  }, [])

  // Draw the initial room (always 4 cards).
  const drawInitialRoom = (currentDeck: Deck) => {
    if (currentDeck.length === 0) return
    const roomSize = Math.min(4, currentDeck.length)
    setRoom(currentDeck.slice(0, roomSize))
    setDeck(currentDeck.slice(roomSize))
  }

  // Draw a new room when the player clicks "Next Room".
  // If exactly one card remains in the current room, keep it and draw 3 new cards.
  // Otherwise, discard the current room and draw a full set of 4 new cards.
  const handleNextRoom = () => {
    if (gameOver) return
    let newRoom = []
    if (room.length === 1) {
      newRoom = [...room]
      const drawCount = Math.min(3, deck.length)
      newRoom = newRoom.concat(deck.slice(0, drawCount))
      setDeck(deck.slice(drawCount))
    } else {
      const drawCount = Math.min(4, deck.length)
      newRoom = deck.slice(0, drawCount)
      setDeck(deck.slice(drawCount))
    }
    setRoom(newRoom)
    setRanAwayLastRoom(false)
  }

  // Remove a card from the current room by its id.
  const removeCardFromRoom = (cardId: number) => {
    setRoom((prev) => prev.filter((card) => card.id !== cardId))
  }
  // Action handlers for each card type.
  const handleDrink = (card: Card) => {
    if (gameOver) return
    const newHealth = Math.min(20, health + card.numericValue)
    setHealth(newHealth)
    removeCardFromRoom(card.id)
  }

  const handleEquip = (card: Card) => {
    if (gameOver) return
    // Equip the weapon and reset any previous weapon usage.
    setEquippedWeapon({ value: card.numericValue, lastUsedAttack: null })
    removeCardFromRoom(card.id)
  }

  const handleFightBareHands = (card: Card) => {
    if (gameOver) return
    const damage = card.numericValue
    setHealth((prev) => prev - damage)
    removeCardFromRoom(card.id)
  }

  const handleFightWithWeapon = (card: Card) => {
    if (gameOver || !equippedWeapon) return
    // If the weapon has been used, enforce that the new monster is strictly weaker.
    if (equippedWeapon.lastUsedAttack !== null && card.numericValue >= equippedWeapon.lastUsedAttack) {
      return // Invalid move; button should be disabled.
    }
    // Calculate damage: monster attack reduced by the weapon's value (minimum 0).
    const damage = Math.max(0, card.numericValue - equippedWeapon.value)
    setHealth((prev) => prev - damage)
    // Update the weapon's last used attack so only weaker monsters can be fought next.
    setEquippedWeapon({ ...equippedWeapon, lastUsedAttack: card.numericValue })
    removeCardFromRoom(card.id)
  }

  // Forfeit the room (run away) and append the remaining cards to the bottom of the deck.
  const handleForfeit = () => {
    if (gameOver || ranAwayLastRoom) return
    const shuffledRoom = shuffle([...room])
    setDeck((prev) => [...prev, ...shuffledRoom])
    setRoom([])
    setRanAwayLastRoom(true)
  }

  // Check for game over.
  useEffect(() => {
    if (health <= 0) {
      setGameOver(true)
    }
  }, [health])


  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">Card Game</h1>
        <div className="flex justify-between items-center mb-4">
          {/* Health Bar */}
          <div>
            <div className="mb-1">Health: {health} / 20</div>
            <div className="w-48 h-4 bg-gray-300 rounded">
              <div
                className="h-4 bg-green-500 rounded"
                style={{ width: `${(health / 20) * 100}%` }}
              ></div>
            </div>
          </div>
          {/* Equipped Weapon Info */}
          <div>
            {equippedWeapon ? (
              <div>
                Equipped Weapon: {equippedWeapon.value}
                <div className="text-sm">
                  Last Monster Killed:{' '}
                  {equippedWeapon.lastUsedAttack !== null ? equippedWeapon.lastUsedAttack : 'None'}
                </div>
              </div>
            ) : (
              <div>No Weapon Equipped</div>
            )}
          </div>
          {/* Deck Count */}
          <div>Deck: {deck.length} cards</div>
        </div>
        {/* Room Cards */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {room.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              onDrink={() => handleDrink(card)}
              onEquip={() => handleEquip(card)}
              onFightBareHands={() => handleFightBareHands(card)}
              onFightWithWeapon={() => handleFightWithWeapon(card)}
              // For monsters, only allow fighting with weapon if no previous weapon use or if this monster is weaker.
              canFightWithWeapon={
                equippedWeapon &&
                (equippedWeapon.lastUsedAttack === null ||
                  card.numericValue < equippedWeapon.lastUsedAttack)
              }
            />
          ))}
        </div>
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            className={`px-4 py-2 rounded ${ranAwayLastRoom ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
              } text-white`}
            onClick={handleForfeit}
            disabled={ranAwayLastRoom || gameOver}
          >
            Forfeit Room
          </button>
          {/* Next Room button is enabled only when the room is either empty or has exactly one card. */}
          <button
            className={`px-4 py-2 rounded ${room.length === 0 || room.length === 1 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'
              } text-white`}
            onClick={handleNextRoom}
            disabled={!(room.length === 0 || room.length === 1) || gameOver}
          >
            Next Room
          </button>
        </div>
        {/* Game Over Message */}
        {gameOver && (
          <div className="text-center text-2xl font-bold text-red-600 mt-4">
            Game Over!
          </div>
        )}
      </div>
    </div>
  )
}

export default App
