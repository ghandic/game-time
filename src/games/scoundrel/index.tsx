import Confetti from 'react-confetti';

import CardComponent from './components/card';
import DeckComponent from './components/deck';
import useGameState from './state';

function Scoundrel() {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <button
          className="px-6 py-3 rounded bg-green-500 hover:bg-green-600 text-white text-xl"
          onClick={handleNewGame}
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Scoundrel</h1>
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
            className="flex flex-row flex-wrap animate-slideIn  gap-2"
          >
            {room.map(card => (
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
                    card.numericValue <
                      equippedWeapon.lastUsedAttack.numericValue)
                }
                globalDisabled={globalDisabled}
              />
            ))}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            className={`px-4 py-2 rounded ${
              unableToForfeit ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
            } text-white ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleForfeit}
            disabled={unableToForfeit || gameOver}
          >
            Forfeit Room
          </button>
          <button
            className={`px-4 py-2 rounded ${
              room.length === 0 || room.length === 1
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-400'
            } text-white ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleNextRoom}
            disabled={!(room.length === 0 || room.length === 1) || gameOver}
          >
            Next Room
          </button>
          <button
            className={`px-4 py-2 rounded ${
              history.length > 0
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
  );
}

export default Scoundrel;
