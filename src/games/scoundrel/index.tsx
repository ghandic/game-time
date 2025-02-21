import { useEffect, useRef, useState } from "react"
import Confetti from 'react-confetti'

import CardComponent from "./components/card"
import DeckComponent from "./components/deck"
import { createDeck, shuffle } from "./logic"
import { Card, Deck, GameState, GameStateHistory, Weapon } from "./types"

function Scoundrel() {
    const [deck, setDeck] = useState<Deck>([])
    const [room, setRoom] = useState<Deck>([])
    const [health, setHealth] = useState<number>(20)
    const [equippedWeapon, setEquippedWeapon] = useState<Weapon | null>(null)
    const [gameOver, setGameOver] = useState<boolean>(false)
    const [won, setWon] = useState<boolean>(false)
    const [history, setHistory] = useState<GameStateHistory[]>([])
    const [roomAnimationKey, setRoomAnimationKey] = useState<number>(0)
    const [gameStarted, setGameStarted] = useState<boolean>(false)
    const [currentRoomNumber, setCurrentRoomNumber] = useState(0);
    const [lastRanAwayRoomNumber, setLastRanAwayRoomNumber] = useState(-1);


    // Use a ref to prevent saving on the initial mount.
    const isInitialMount = useRef(true)

    // Load saved state on mount (if any)
    useEffect(() => {
        const savedState = localStorage.getItem('cardGameState-1')
        if (savedState) {
            const parsed = JSON.parse(savedState) as GameState
            console.log("Loading state:", parsed)
            setDeck(parsed.deck)
            setRoom(parsed.room)
            setHealth(parsed.health)
            setEquippedWeapon(parsed.equippedWeapon)
            setCurrentRoomNumber(parsed.currentRoomNumber)
            setLastRanAwayRoomNumber(parsed.lastRanAwayRoomNumber)
            setGameOver(parsed.gameOver)
            setWon(parsed.won)
            setHistory(parsed.history || [])
            setGameStarted(parsed.gameStarted)
        }
    }, [])

    // Save state to localStorage whenever key values change, but skip the initial mount.
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            return
        }
        const stateToSave: GameState = {
            deck,
            room,
            health,
            equippedWeapon,
            currentRoomNumber,
            lastRanAwayRoomNumber,
            gameOver,
            won,
            history,
            gameStarted,
        }
        console.log("Saving state:", stateToSave)
        localStorage.setItem('cardGameState-1', JSON.stringify(stateToSave))
    }, [deck, room, health, equippedWeapon, currentRoomNumber, lastRanAwayRoomNumber, gameOver, won, history, gameStarted])

    // Save current state snapshot to history.
    const saveState = () => {
        const stateSnapshot: GameStateHistory = {
            deck: [...deck],
            room: [...room],
            health,
            equippedWeapon: equippedWeapon ? { ...equippedWeapon } : null,
            currentRoomNumber,
            lastRanAwayRoomNumber,
            gameOver,
            won,
        }
        setHistory((prev) => [...prev, stateSnapshot])
    }

    // Undo the last action.
    const handleUndo = () => {
        if (history.length === 0) return
        const previousState = history[history.length - 1]
        setDeck(previousState.deck)
        setRoom(previousState.room)
        setHealth(previousState.health)
        setEquippedWeapon(previousState.equippedWeapon)
        setCurrentRoomNumber(previousState.currentRoomNumber)
        setLastRanAwayRoomNumber(previousState.lastRanAwayRoomNumber)
        setGameOver(previousState.gameOver)
        setWon(previousState.won)
        setHistory((prev) => prev.slice(0, prev.length - 1))
    }

    // Start a new game.
    const handleNewGame = () => {
        const newDeck = createDeck()
        const roomSize = Math.min(4, newDeck.length)
        setDeck(newDeck.slice(roomSize))
        setRoom(newDeck.slice(0, roomSize))
        setHealth(20)
        setEquippedWeapon(null)
        setCurrentRoomNumber(0)
        setLastRanAwayRoomNumber(-1)
        setGameOver(false)
        setWon(false)
        setHistory([])
        setRoomAnimationKey((prev) => prev + 1)
        setGameStarted(true)
    }

    // Draw the next room.
    const handleNextRoom = () => {
        if (gameOver) return
        saveState()
        let newRoom: Deck = []
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
        setCurrentRoomNumber((prev) => prev + 1)
        setRoomAnimationKey((prev) => prev + 1)
    }

    // Remove a card from the room.
    const removeCardFromRoom = (cardId: number) => {
        setRoom((prev) => prev.filter((card) => card.id !== cardId))
    }

    // Action handlers.
    const handleDrink = (card: Card) => {
        if (gameOver) return
        saveState()
        setHealth(Math.min(20, health + card.numericValue))
        removeCardFromRoom(card.id)
    }

    const handleEquip = (card: Card) => {
        if (gameOver) return
        saveState()
        setEquippedWeapon({ ...card, lastUsedAttack: null })
        removeCardFromRoom(card.id)
    }

    const handleFightBareHands = (card: Card) => {
        if (gameOver) return
        saveState()
        setHealth((prev) => prev - card.numericValue)
        removeCardFromRoom(card.id)
    }

    const handleFightWithWeapon = (card: Card) => {
        if (gameOver || !equippedWeapon) return
        if (
            equippedWeapon.lastUsedAttack !== null &&
            card.numericValue >= equippedWeapon.lastUsedAttack.numericValue
        ) {
            return
        }
        saveState()
        setHealth((prev) => prev - Math.max(0, card.numericValue - equippedWeapon.numericValue))
        setEquippedWeapon({ ...equippedWeapon, lastUsedAttack: card })
        removeCardFromRoom(card.id)
    }

    const ableToForfeit = lastRanAwayRoomNumber === -1 || currentRoomNumber - lastRanAwayRoomNumber >= 2
    const unableToForfeit = !ableToForfeit

    const handleForfeit = () => {
        if (gameOver || unableToForfeit) return
        saveState()
        const shuffledRoom = shuffle([...room])
        setDeck((prev) => [...prev, ...shuffledRoom])
        setRoom([])
        setLastRanAwayRoomNumber(currentRoomNumber)
    }


    // Check win condition: only if game has started.
    useEffect(() => {
        if (
            gameStarted &&
            !gameOver &&
            health > 0 &&
            deck.length === 0 &&
            room.length === 0
        ) {
            setWon(true)
            setGameOver(true)
        }
    }, [gameStarted, deck, room, health, gameOver])

    // Global disabled state.
    const globalDisabled = gameOver

    // If the game hasn't started yet, show a "Start Game" screen.
    if (!gameStarted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <button
                    className="px-6 py-3 rounded bg-green-500 hover:bg-green-600 text-white text-xl"
                    onClick={handleNewGame}
                >
                    Start Game
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-4 bg-gray-100">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-6">Scoundrel</h1>
                {/* Confetti for win */}
                {won && <Confetti width={window.innerWidth} height={window.innerHeight} />}
                {/* Status Bar */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <div className="mb-1 text-lg">Health: {health} / 20</div>
                        <div className="w-48 h-4 bg-gray-300 rounded">
                            <div
                                className="h-4 bg-green-500 rounded"
                                style={{ width: `${(health / 20) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="text-lg">
                        {equippedWeapon ? (
                            <div>
                                Equipped Weapon: <span style={{
                                    color: ['♦', '♥'].includes(equippedWeapon.suit) ? 'red' : 'black'
                                }}>{equippedWeapon.value} {equippedWeapon.suit}</span> <br />
                                <span className="text-sm">
                                    Last Monster Killed:{' '}
                                    <span style={{
                                        color: ['♦', '♥'].includes(equippedWeapon?.lastUsedAttack?.suit ?? "") ? 'red' : 'black'
                                    }}>
                                        {equippedWeapon.lastUsedAttack !== null ? equippedWeapon.lastUsedAttack.value : 'None'}
                                        {equippedWeapon.lastUsedAttack !== null ? equippedWeapon.lastUsedAttack.suit : ''}
                                    </span>

                                </span>
                            </div>
                        ) : (
                            <div>No Weapon Equipped</div>
                        )}
                    </div>
                    {/* <div className="text-lg">Deck: {deck.length} cards</div> */}
                </div>
                {/* Main Play Area */}
                <div className="flex items-start gap-2">
                    {/* Deck */}
                    <DeckComponent deckCount={deck.length} />
                    {/* Room Cards with animation */}
                    <div key={roomAnimationKey} className="flex flex-row flex-wrap animate-slideIn  gap-2">
                        {room.map((card) => (
                            <CardComponent
                                key={card.id}
                                card={card}
                                onDrink={() => handleDrink(card)}
                                onEquip={() => handleEquip(card)}
                                onFightBareHands={() => handleFightBareHands(card)}
                                onFightWithWeapon={() => handleFightWithWeapon(card)}
                                canFightWithWeapon={
                                    equippedWeapon &&
                                    (equippedWeapon.lastUsedAttack === null ||
                                        card.numericValue < equippedWeapon.lastUsedAttack.numericValue)
                                }
                                globalDisabled={globalDisabled}
                            />
                        ))}
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="flex justify-center space-x-4 mt-6">
                    <button
                        className={`px-4 py-2 rounded ${unableToForfeit
                            ? 'bg-gray-400'
                            : 'bg-red-500 hover:bg-red-600'
                            } text-white ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleForfeit}
                        disabled={unableToForfeit || gameOver}
                    >
                        Forfeit Room
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${room.length === 0 || room.length === 1
                            ? 'bg-blue-500 hover:bg-blue-600'
                            : 'bg-gray-400'
                            } text-white ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleNextRoom}
                        disabled={!(room.length === 0 || room.length === 1) || gameOver}
                    >
                        Next Room
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${history.length > 0
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : 'bg-gray-400'
                            } text-white ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleUndo}
                        disabled={history.length === 0}
                    >
                        Undo
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
                        onClick={handleNewGame}
                    >
                        New Game
                    </button>
                </div>
                {gameOver && (
                    <div className="text-center text-3xl font-bold mt-6">
                        {won ? (
                            <span className="text-green-600">You Win!</span>
                        ) : (
                            <span className="text-red-600">Game Over!</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Scoundrel
