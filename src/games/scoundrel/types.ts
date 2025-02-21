import { BaseCard } from '../../types';

export type CardType = 'monster' | 'potion' | 'weapon';

export type ScoundrelCard = BaseCard & {
  id: number;
  numericValue: number;
  type: CardType;
};
export type Deck = ScoundrelCard[];

export type Weapon = ScoundrelCard & { lastUsedAttack: ScoundrelCard | null };

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
