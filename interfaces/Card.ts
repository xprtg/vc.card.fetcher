import { CardRarity, Elements } from "../card_db/definitions";

export interface Card {
    name: string;
    element: Elements;
    rarity: CardRarity;
    stats: CardStats[];
}

export interface CardStats {
    rarity: Rarity;
    "Max Level": number;
    Cost: number;
    Attack: [number, number];
    Defense: [number, number];
    Soldiers: [number, number];
}

export enum Rarity {
    ZeroStar = "0✰",
    OneStar = "1★",
    GoldStar = "G★",
    XStar = "X★"
}

