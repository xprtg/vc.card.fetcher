import { Card, Stats } from "../interfaces/Card";

export const createCard = ({ name, stats }: { name: string, stats: Stats }): Card => {
    console.log({ buildingCardFor: name })
    return {
        name,
        stats
    }
};
