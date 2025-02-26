import { Button } from '@/components/ui/button';
import { FlaskConical, Hand, Sword, Swords } from 'lucide-react';
import { ClassAttributes, HTMLAttributes } from 'react';
import { JSX } from 'react/jsx-runtime';

import Card from '../../../components/card';
import { ScoundrelCard } from '../types';

type ScoundrelCardProps = {
  onDrink: () => void;
  onEquip: () => void;
  onFightBareHands: () => void;
  onFightWithWeapon: () => void;
  canFightWithWeapon: boolean | null;
  globalDisabled: boolean;
  card: ScoundrelCard;
};



const ScoundrelCardComponent = ({
  card,
  onDrink,
  onEquip,
  onFightBareHands,
  onFightWithWeapon,
  canFightWithWeapon,
  globalDisabled,
}: ScoundrelCardProps) => {
  const buttonClasses = (base: string, disabled: boolean) =>
    `${base} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`;

  return (
    <Card card={card}>
      <div className="flex flex-row gap-1 items-center justify-center mt-2">
        {card.type === 'potion' && (
          <Button
            className={buttonClasses(
              'bg-green-500 hover:bg-green-400 text-white text-xs px-2 py-1 rounded',
              globalDisabled,
            )}
            onClick={onDrink}
            disabled={globalDisabled}
          >
            <FlaskConical size={16} />
          </Button>
        )}
        {card.type === 'weapon' && (
          <Button
            className={buttonClasses(
              'bg-blue-500 hover:bg-blue-400 text-white text-xs px-2 py-1 rounded',
              globalDisabled,
            )}
            onClick={onEquip}
            disabled={globalDisabled}
          >
            <Sword size={16} />
          </Button>
        )}
        {card.type === 'monster' && (
          <>
            <Button
              className={buttonClasses(
                'bg-red-500 hover:bg-red-400 text-white text-xs px-2 py-1 rounded',
                globalDisabled,
              )}
              onClick={onFightBareHands}
              disabled={globalDisabled}
            >
              <Hand size={16} />
            </Button>
            {!(globalDisabled || !canFightWithWeapon) && (
              <Button
                className={buttonClasses(
                  'bg-purple-500 hover:bg-purple-400 text-white text-xs px-2 py-1 rounded',
                  globalDisabled || !canFightWithWeapon,
                )}
                onClick={onFightWithWeapon}
              >
                <Swords size={16} />
              </Button>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export const PlaceholderCard = (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>) => (
  <div
    className="w-36 h-48"
    {...props}
  >
  </div>
)

export default ScoundrelCardComponent;
