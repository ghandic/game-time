import { BaseCard } from '../types';

type CardProps = React.PropsWithChildren<{ card: BaseCard }>;

// Styled like a real playing card.
const Card = ({ card, children }: CardProps) => {
  return (
    <div className="w-36 h-48 bg-white rounded-lg border border-gray-300 shadow-md p-2 flex flex-col justify-between">
      <div
        className="text-xl font-bold"
        style={{ color: ['♦', '♥'].includes(card.suit) ? 'red' : 'black' }}
      >
        {card.suit} {card.value}
      </div>
      {children}
      <div
        className="text-xl font-bold text-right"
        style={{ color: ['♦', '♥'].includes(card.suit) ? 'red' : 'black' }}
      >
        {card.suit} {card.value}
      </div>
    </div>
  );
};

export default Card;
