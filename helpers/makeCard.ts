import { CardRarity, Elements } from "../card_db/definitions";
import { Card, CardStats } from "../interfaces/Card";

export const createCard = ({ name, element, rarity, stats }: { name: string, element: Elements, rarity: CardRarity, stats: CardStats[] }): Card => {
    return {
        name,
        element,
        rarity,
        stats
    }
};
