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
      <div className="flex flex-col gap-1 items-center justify-center">
        {card.type === 'potion' && (
          <button
            className={buttonClasses(
              'bg-green-500 text-white text-xs px-2 py-1 rounded',
              globalDisabled,
            )}
            onClick={onDrink}
            disabled={globalDisabled}
          >
            Drink
          </button>
        )}
        {card.type === 'weapon' && (
          <button
            className={buttonClasses(
              'bg-blue-500 text-white text-xs px-2 py-1 rounded',
              globalDisabled,
            )}
            onClick={onEquip}
            disabled={globalDisabled}
          >
            Equip
          </button>
        )}
        {card.type === 'monster' && (
          <>
            <button
              className={buttonClasses(
                'bg-red-500 text-white text-xs px-2 py-1 rounded',
                globalDisabled,
              )}
              onClick={onFightBareHands}
              disabled={globalDisabled}
            >
              Bare Hands
            </button>
            {!(globalDisabled || !canFightWithWeapon) && (
              <button
                className={buttonClasses(
                  'bg-purple-500 text-white text-xs px-2 py-1 rounded',
                  globalDisabled || !canFightWithWeapon,
                )}
                onClick={onFightWithWeapon}
              >
                With Weapon
              </button>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export const PlaceholderCard = (props: JSX.IntrinsicAttributes & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>) => (<div
  {...props}
  className="w-36 h-48 border border-gray-300 rounded"
></div>)

export default ScoundrelCardComponent;
