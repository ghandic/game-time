// Represent the deck as a card back.
const DeckComponent = ({ deckCount }: { deckCount: number }) => {
  return (
    <div className="w-36 h-48 bg-blue-900 rounded-lg border border-gray-300 shadow-md flex items-center justify-center">
      {deckCount > 0 ? (
        <span className="text-white font-bold text-xs text-center">
          Deck ({deckCount})
        </span>
      ) : (
        <span className="text-white font-bold text-xs">Empty</span>
      )}
    </div>
  );
};
export default DeckComponent;
