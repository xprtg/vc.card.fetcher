export interface Card {
    name: string;
    stats: CardStats[]
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

