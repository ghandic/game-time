import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Hand, Info, Sword, Swords } from 'lucide-react';
import Confetti from 'react-confetti';
import Markdown from 'react-markdown'

import DeckComponent from '../../components/deck';
import useMeta from '../../hooks/useMeta';
import ScoundrelCardComponent, { PlaceholderCard } from './components/card';
import useGameState from './state';

const info = `
# Scoundrel

## Description

Scoundrel is a challenging and strategic solo roguelite card game where you fight monsters and drink potions to survive.

## Rules

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

## Credits

This game was built by Andy Challis and designed by Zach Gage, Kurt Bieg. You can find the original game [here](https://www.youtube.com/watch?v=7fP-QLtWQZs).
`

function Scoundrel() {

  useMeta({
    title: "Game Time - Scoundrel",
    description: "Scoundrel is a challenging and strategic solo roguelite card game where you fight monsters and drink potions to survive.",
    keywords: "scoundrel, card game, roguelite, monsters, potions, fight, survive",
    authors: ["Zach Gage", "Kurt Bieg"],
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
      <div className='flex flex-row justify-center gap-3 items-center mb-6'>
        <div className='relative'>
          <h1 className="text-4xl font-bold ">Scoundrel</h1>
          <div className='absolute top-1 -left-10'><Dialog>
            <DialogTrigger asChild><Button variant="link"><Info /></Button></DialogTrigger>
            <DialogContent className="min-w-10/12 max-h-3/4 overflow-y-auto">
              <Markdown components={{
                h1: ({ ...props }) => (
                  <h1
                    className='text-2xl font-bold py-1'
                    {...props}
                  />
                ),
                h2: ({ ...props }) => (
                  <h2
                    className='text-xl font-bold py-2'
                    {...props}
                  />
                ),
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
                {info}
              </Markdown>
            </DialogContent>
          </Dialog></div>
        </div>

      </div>
      {/* Confetti for win */}
      {won && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      {/* Status Bar */}
      <div className="flex justify-between items-center mb-4">
        {/* Health and Deck Count */}
        <div className='flex flex-row gap-1 w-48 items-center'>
          <div className='flex flex-row gap-1 items-center px-2'>
            <div className="w-5 h-6 rounded bg-red-600 " />
            <div
              className="font-bold text-md"
            >
              {deck.length}
            </div>
          </div>
          {Array.from({ length: 10 }).map((_, index) => {
            let imageSrc = `/images/cards/heart${index < health / 2 ? '-full' : '-empty'}.png`;
            if (index === Math.floor(health / 2) && health / 2 % 1 !== 0) {
              imageSrc = '/images/cards/heart-half.png';
            }
            return (
              <img
                key={index}
                className='w-5 h-5'
                src={imageSrc}
              />
            );
          })}
        </div>

        {/* Equipped Weapon */}
        <div className="w-20">
          <div className='flex flex-row gap-2'>

            {equippedWeapon ? (
              <>
                <div className='flex flex-row gap-1 items-center bg-red-600 rounded px-2 py-1'>
                  <Sword className='text-white h-4 w-4' />
                  <div
                    className="font-bold text-md text-white"
                  >
                    {equippedWeapon.value}
                  </div>
                </div>
                {equippedWeapon?.lastUsedAttack && <div className='flex flex-row gap-1 items-center bg-purple-600 rounded  px-2 py-1'>
                  <Swords className='text-white h-4 w-4' />
                  <div
                    className="text-md text-white"
                  >
                    <span className='font-bold mr-1'>{equippedWeapon.lastUsedAttack !== null
                      ? equippedWeapon.lastUsedAttack.value
                      : ''}</span>
                    {equippedWeapon.lastUsedAttack !== null
                      ? equippedWeapon.lastUsedAttack.suit
                      : ''}
                  </div>
                </div>}
              </>
            ) : (
              <div className='flex flex-row gap-1 items-center bg-red-600 rounded  px-2 py-1'>
                <Hand className='text-white h-4 w-4' />
                <div
                  className="font-bold text-md text-white"
                >
                  0
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-left space-x-1">
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
      </div>
      {/* Main Play Area */}
      <div className="flex items-start gap-2">
        {/* Deck */}
        <div className='flex flex-col gap-2 items-center'>
          <DeckComponent />
          <div className='flex flex-row gap-2'><Button
            className={`${unableToForfeit ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'
              }  ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleForfeit}
            disabled={unableToForfeit || gameOver}
          >
            Skip
          </Button>
            <Button
              className={`px-4 py-2 ${room.length === 0 || room.length === 1
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-400'
                } text-white ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleNextRoom}
              disabled={!(room.length === 0 || room.length === 1) || gameOver}
            >
              Next
            </Button></div>
        </div>
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
