import { useEffect, useRef, useState } from 'react';

import {
  Card,
  CardType,
  CardValue,
  Deck,
  GameState,
  GameStateHistory,
  Suit,
  Weapon,
} from './types';

const storageKey = 'cardGameState-2';

// Utility: shuffle an array in-place using Fisher-Yates algorithm
function shuffle(array: Deck) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

// Create a new deck based on your rules.
function createDeck(): Deck {
  const deck: Deck = [];
  let idCounter = 0;
  const faceCards = ['J', 'Q', 'K', 'Ace'];
  const suitsMonsters: Suit[] = ['♠', '♣'];
  // Monster cards
  suitsMonsters.forEach(suit => {
    for (let i = 2; i <= 10; i++) {
      deck.push({
        id: idCounter++,
        suit,
        value: i.toString() as CardValue,
        numericValue: i,
        type: 'monster',
      });
    }
    faceCards.forEach(card => {
      const numericValue =
        card === 'J' ? 11 : card === 'Q' ? 12 : card === 'K' ? 13 : 14;
      deck.push({
        id: idCounter++,
        suit,
        value: card as CardValue,
        numericValue,
        type: 'monster',
      });
    });
  });

  // Hearts and Diamonds (only 2-10)
  const otherSuits: { suit: Suit; type: CardType }[] = [
    { suit: '♥', type: 'potion' },
    { suit: '♦', type: 'weapon' },
  ];
  otherSuits.forEach(({ suit, type }) => {
    for (let i = 2; i <= 10; i++) {
      deck.push({
        id: idCounter++,
        suit,
        value: i.toString() as CardValue,
        numericValue: i,
        type,
      });
    }
  });

  return shuffle(deck);
}

const useGameState = () => {
  const [deck, setDeck] = useState<Deck>([]);
  const [room, setRoom] = useState<Deck>([]);
  const [health, setHealth] = useState<number>(100);
  const [equippedWeapon, setEquippedWeapon] = useState<Weapon | null>(null);
  const [currentRoomNumber, setCurrentRoomNumber] = useState<number>(0);
  const [lastRanAwayRoomNumber, setLastRanAwayRoomNumber] =
    useState<number>(-1);
  const [roomAnimationKey, setRoomAnimationKey] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [history, setHistory] = useState<GameStateHistory[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Use a ref to prevent saving on the initial mount.
  const isInitialMount = useRef(true);

  // Load saved state on mount (if any)
  useEffect(() => {
    const savedState = localStorage.getItem(storageKey);
    if (savedState) {
      const parsed = JSON.parse(savedState) as GameState;
      console.log('Loading state:', parsed);
      setDeck(parsed.deck);
      setRoom(parsed.room);
      setHealth(parsed.health);
      setEquippedWeapon(parsed.equippedWeapon);
      setCurrentRoomNumber(parsed.currentRoomNumber);
      setLastRanAwayRoomNumber(parsed.lastRanAwayRoomNumber);
      setGameOver(parsed.gameOver);
      setWon(parsed.won);
      setHistory(parsed.history || []);
      setGameStarted(parsed.gameStarted);
    }
  }, []);

  // Save state to localStorage whenever key values change, but skip the initial mount.
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
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
    };
    console.log('Saving state:', stateToSave);
    localStorage.setItem(storageKey, JSON.stringify(stateToSave));
  }, [
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
  ]);

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
    };
    setHistory(prev => [...prev, stateSnapshot]);
  };

  // Draw the next room.
  const handleNextRoom = () => {
    if (gameOver) return;
    saveState();
    let newRoom: Deck = [];
    if (room.length === 1) {
      newRoom = [...room];
      const drawCount = Math.min(3, deck.length);
      newRoom = newRoom.concat(deck.slice(0, drawCount));
      setDeck(deck.slice(drawCount));
    } else {
      const drawCount = Math.min(4, deck.length);
      newRoom = deck.slice(0, drawCount);
      setDeck(deck.slice(drawCount));
    }
    setRoom(newRoom);
    setCurrentRoomNumber(prev => prev + 1);
    setRoomAnimationKey(prev => prev + 1);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setDeck(previousState.deck);
    setRoom(previousState.room);
    setHealth(previousState.health);
    setEquippedWeapon(previousState.equippedWeapon);
    setCurrentRoomNumber(previousState.currentRoomNumber);
    setLastRanAwayRoomNumber(previousState.lastRanAwayRoomNumber);
    setGameOver(previousState.gameOver);
    setWon(previousState.won);
    setHistory(prev => prev.slice(0, prev.length - 1));
  };

  const handleNewGame = () => {
    const newDeck = createDeck();
    const roomSize = Math.min(4, newDeck.length);
    setDeck(newDeck.slice(roomSize));
    setRoom(newDeck.slice(0, roomSize));
    setHealth(20);
    setEquippedWeapon(null);
    setCurrentRoomNumber(0);
    setLastRanAwayRoomNumber(-1);
    setGameOver(false);
    setWon(false);
    setHistory([]);
    setRoomAnimationKey(prev => prev + 1);
    setGameStarted(true);
  };

  const removeCardFromRoom = (cardId: number) => {
    setRoom(prev => prev.filter(card => card.id !== cardId));
  };

  const handleDrink = (card: Card) => {
    if (gameOver) return;
    saveState();
    setHealth(Math.min(20, health + card.numericValue));
    removeCardFromRoom(card.id);
  };

  const handleEquip = (card: Card) => {
    if (gameOver) return;
    saveState();
    setEquippedWeapon({ ...card, lastUsedAttack: null });
    removeCardFromRoom(card.id);
  };

  const handleFightBareHands = (card: Card) => {
    if (gameOver) return;
    saveState();
    setHealth(prev => prev - card.numericValue);
    removeCardFromRoom(card.id);
  };

  const handleFightWithWeapon = (card: Card) => {
    if (gameOver || !equippedWeapon) return;
    if (
      equippedWeapon.lastUsedAttack !== null &&
      card.numericValue >= equippedWeapon.lastUsedAttack.numericValue
    ) {
      return;
    }
    saveState();
    setHealth(
      prev =>
        prev - Math.max(0, card.numericValue - equippedWeapon.numericValue),
    );
    setEquippedWeapon({ ...equippedWeapon, lastUsedAttack: card });
    removeCardFromRoom(card.id);
  };

  const ableToForfeit =
    lastRanAwayRoomNumber === -1 ||
    currentRoomNumber - lastRanAwayRoomNumber >= 2;
  const unableToForfeit = !ableToForfeit;

  const handleForfeit = () => {
    if (gameOver || unableToForfeit) return;
    saveState();
    const shuffledRoom = shuffle([...room]);
    setDeck(prev => [...prev, ...shuffledRoom]);
    setRoom([]);
    setLastRanAwayRoomNumber(currentRoomNumber);
  };

  // Check win condition: only if game has started.
  useEffect(() => {
    if (
      gameStarted &&
      !gameOver &&
      health > 0 &&
      deck.length === 0 &&
      room.length === 0
    ) {
      setWon(true);
      setGameOver(true);
    }
  }, [gameStarted, deck, room, health, gameOver]);

  // Global disabled state.
  const globalDisabled = gameOver;

  return {
    globalDisabled,
    roomAnimationKey,
    handleForfeit,
    ableToForfeit,
    unableToForfeit,
    handleFightWithWeapon,
    handleFightBareHands,
    deck,
    setDeck,
    room,
    setRoom,
    health,
    setHealth,
    equippedWeapon,
    setEquippedWeapon,
    currentRoomNumber,
    setCurrentRoomNumber,
    lastRanAwayRoomNumber,
    setLastRanAwayRoomNumber,
    gameOver,
    setGameOver,
    won,
    setWon,
    history,
    setHistory,
    gameStarted,
    setGameStarted,
    saveState,
    handleNextRoom,
    handleUndo,
    handleNewGame,
    handleDrink,
    handleEquip,
  };
};

export default useGameState;
