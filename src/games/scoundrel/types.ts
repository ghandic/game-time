export type Suit = '♠' | '♣' | '♥' | '♦';
export type CardType = 'monster' | 'potion' | 'weapon';
export type CardValue =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'Ace';
export type Card = {
  id: number;
  suit: Suit;
  value: CardValue;
  numericValue: number;
  type: CardType;
};
export type Deck = Card[];

export type Weapon = Card & { lastUsedAttack: Card | null };

export interface GameState {
  deck: Deck;
  room: Deck;
  health: number;
  equippedWeapon: Weapon | null;
  currentRoomNumber: number;
  lastRanAwayRoomNumber: number;
  gameOver: boolean;
  won: boolean;
  history: GameStateHistory[];
  gameStarted: boolean;
}

export type GameStateHistory = {
  deck: Deck;
  room: Deck;
  health: number;
  equippedWeapon: Weapon | null;
  currentRoomNumber: number;
  lastRanAwayRoomNumber: number;
  gameOver: boolean;
  won: boolean;
};
