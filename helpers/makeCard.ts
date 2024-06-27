import { Card, CardStats } from "../interfaces/Card";

export const createCard = ({ name, stats }: { name: string, stats: CardStats[] }): Card => {
    console.log({ buildingCardFor: name })
    return {
        name,
        stats
    }
};
