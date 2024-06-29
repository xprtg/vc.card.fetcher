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
    image_url: string
}

export enum Rarity {
    "0✰" = "0✰",
    "1★" = "1★",
    "2★" = "2★",
    "3★" = "3★",
    "4★" = "4★",
    "G★" = "G★",
    "X★" = "X★"
}

