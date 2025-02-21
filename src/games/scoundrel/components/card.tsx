import { Card } from "../types"

type CardProps = {
    card: Card
    onDrink: () => void
    onEquip: () => void
    onFightBareHands: () => void
    onFightWithWeapon: () => void
    canFightWithWeapon: boolean | null
    globalDisabled: boolean
}

// Styled like a real playing card.
const CardComponent = ({
    card,
    onDrink,
    onEquip,
    onFightBareHands,
    onFightWithWeapon,
    canFightWithWeapon,
    globalDisabled,
}: CardProps) => {
    const buttonClasses = (base: string, disabled: boolean) =>
        `${base} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`

    return (
        <div className="w-36 h-48 bg-white rounded-lg border border-gray-300 shadow-md p-2 flex flex-col justify-between">
            <div
                className="text-xl font-bold"
                style={{ color: ['♦', '♥'].includes(card.suit) ? 'red' : 'black' }}
            >
                {card.suit} {card.value}
            </div>
            <div className="flex flex-col gap-1 items-center justify-center">
                {card.type === 'potion' && (
                    <button
                        className={buttonClasses(
                            'bg-green-500 text-white text-xs px-2 py-1 rounded',
                            globalDisabled
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
                            globalDisabled
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
                                globalDisabled
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
                                    globalDisabled || !canFightWithWeapon
                                )}
                                onClick={onFightWithWeapon}
                            >
                                With Weapon
                            </button>
                        )}

                    </>
                )}
            </div>
            <div
                className="text-xl font-bold text-right"
                style={{ color: ['♦', '♥'].includes(card.suit) ? 'red' : 'black' }}
            >
                {card.suit} {card.value}
            </div>
        </div>
    )
}

export default CardComponent;