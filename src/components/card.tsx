import { BaseCard } from '../types';

type CardProps = React.PropsWithChildren<{ card: BaseCard }>;

const emojiToLetter = (emoji: string) => {
  switch (emoji) {
    case '♦':
      return 'd';
    case '♥':
      return 'h';
    case '♠':
      return 's';
    case '♣':
      return 'c';
    default:
      return emoji;
  }
}

const cardValueToImageNumber = (value: string) => {
  switch (value) {
    case 'J':
      return 11;
    case 'Q':
      return 12;
    case 'K':
      return 13;
    case 'Ace':
      return 1;
    default:
      return parseInt(value);
  }
}
// Styled like a real playing card.
const Card = ({ card, children }: CardProps) => {
  return (
    <div className='animate-slideIn'>
      <img className="w-32 h-44 md:w-36 md:h-48 shadow-md" src={`/images/cards/${cardValueToImageNumber(card.value)}${emojiToLetter(card.suit)}.png`} />
      {children}
    </div>
  );
};

export default Card;
