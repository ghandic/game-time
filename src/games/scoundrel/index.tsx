import Attribution from '@/components/attribution';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Confetti from 'react-confetti';
import Markdown from 'react-markdown'

import DeckComponent from '../../components/deck';
import useMeta from '../../hooks/useMeta';
import ScoundrelCardComponent, { PlaceholderCard } from './components/card';
import useGameState from './state';

const rules = `
- Deck of cards consists of ♠️♣️ 2-10,J,Q,K,Ace and ♥️♦️ 2-10
- Diamonds are weapon cards, Hearts are health potions and they heal for the number given
- Spades and Clubs are Monsters
- Deck is fully shuffled
- You start on 20 health and you cannot go above 20 health, if you fall below 20 then you die
- The number on the monsters represents their attack 2-10, J=11, Q=12, K=13, Ace=14
- A room (4 cards) is drawn from the deck, you can draw your next room by either:
    - Getting the room down to 1 or less cards by; drinking health potions, killing monsters or equipping weapons
    - Running away from the room - you cannot do this two rooms in a row. When you run away from the room the remaining cards in the room are shuffled and put to the back of the deck
- You can fight a monster either:
    - with your bare hands (you will take all of the damage equal to the number on the card)
    - With a weapon, which reduces the attack of the monster equal to the difference
    - Note: When a weapon has been used, you can only kill weaker monsters than the one already killed with the weapon, eg if you killed a 5♣️ you could not kill a 7♣️ or a 5♠️, only 2-4♠️♣️
`

function Scoundrel() {

  const meta = useMeta({
    title: "Game Time - Scoundrel",
    description: "Scoundrel is a challenging and strategic solo roguelite card game where you fight monsters and drink potions to survive.",
    keywords: "scoundrel, card game, roguelite, monsters, potions, fight, survive",
    authors: ["Zach Gage", "Kurt Bieg"],
    link: "https://www.youtube.com/watch?v=7fP-QLtWQZs"
  });

  const {
    globalDisabled,
    unableToForfeit,
    handleFightWithWeapon,
    handleFightBareHands,
    deck,
    room,
    health,
    equippedWeapon,
    gameOver,
    won,
    history,
    gameStarted,
    handleNextRoom,
    handleUndo,
    handleForfeit,
    handleNewGame,
    handleDrink,
    handleEquip,
    roomAnimationKey,
  } = useGameState();

  // If the game hasn't started yet, show a "Start Game" screen.
  if (!gameStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Scoundrel</h1>
        <div className="flex items-center justify-center">
          <Button
            className="px-6 py-3 rounded bg-green-500 hover:bg-green-600 text-white text-xl cursor-pointer"
            onClick={handleNewGame}
          >
            Start Game
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className='flex flex-row justify-center'>
        <div className='relative'>
          <h1 className="text-4xl font-bold mb-6">Scoundrel</h1>
          <div className='absolute top-2.5 -left-10'><Attribution {...meta} /></div>
        </div>
      </div>
      {/* Confetti for win */}
      {won && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}
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
        <Popover>
          <PopoverTrigger asChild><Button>Rules</Button></PopoverTrigger>
          <PopoverContent className='w-[1000px]'>
            <Markdown components={{
              ul: ({ ...props }) => (
                <ul
                  style={{
                    display: "block",
                    listStyleType: "disc",
                    paddingInlineStart: "40px",
                  }}
                  {...props}
                />
              ),
            }}>
              {rules}
            </Markdown>
          </PopoverContent>
        </Popover>
        <div className="text-lg">
          {equippedWeapon ? (
            <div>
              Equipped Weapon:{' '}
              <span
                style={{
                  color: ['♦', '♥'].includes(equippedWeapon.suit)
                    ? 'red'
                    : 'black',
                }}
              >
                {equippedWeapon.value} {equippedWeapon.suit}
              </span>{' '}
              <br />
              <span className="text-sm">
                Last Monster Killed:{' '}
                <span
                  style={{
                    color: ['♦', '♥'].includes(
                      equippedWeapon?.lastUsedAttack?.suit ?? '',
                    )
                      ? 'red'
                      : 'black',
                  }}
                >
                  {equippedWeapon.lastUsedAttack !== null
                    ? equippedWeapon.lastUsedAttack.value
                    : 'None'}
                  {equippedWeapon.lastUsedAttack !== null
                    ? equippedWeapon.lastUsedAttack.suit
                    : ''}
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
        <div
          key={roomAnimationKey}
          className="flex flex-row flex-wrap animate-slideIn gap-2"
        >
          {room.map(card => (
            <ScoundrelCardComponent
              key={card.id}
              card={card}
              onDrink={() => handleDrink(card)}
              onEquip={() => handleEquip(card)}
              onFightBareHands={() => handleFightBareHands(card)}
              onFightWithWeapon={() => handleFightWithWeapon(card)}
              canFightWithWeapon={
                equippedWeapon &&
                (equippedWeapon.lastUsedAttack === null ||
                  card.numericValue <
                  equippedWeapon.lastUsedAttack.numericValue)
              }
              globalDisabled={globalDisabled}
            />
          ))}
          {Array.from({ length: 4 - room.length }).map((_, index) => (
            <PlaceholderCard
              key={`placeholder-${index}`}
            ></PlaceholderCard>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-6">
        <Button
          className={`${unableToForfeit ? 'bg-gray-400' : ''
            }  ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
          variant="destructive"
          onClick={handleForfeit}
          disabled={unableToForfeit || gameOver}
        >
          Forfeit Room
        </Button>
        <Button
          className={`px-4 py-2 ${room.length === 0 || room.length === 1
            ? 'bg-blue-500 hover:bg-blue-600'
            : 'bg-gray-400'
            } text-white ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleNextRoom}
          disabled={!(room.length === 0 || room.length === 1) || gameOver}
        >
          Next Room
        </Button>
        <Button
          className={`px-4 py-2 ${history.length > 0
            ? 'bg-yellow-500 hover:bg-yellow-600'
            : 'bg-gray-400'
            } text-white`}
          onClick={handleUndo}
          disabled={history.length === 0}
        >
          Undo
        </Button>
        <Button
          variant="success"
          onClick={handleNewGame}
        >
          New Game
        </Button>
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
  );
}



export default Scoundrel;
