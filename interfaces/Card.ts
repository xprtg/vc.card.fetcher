export interface Card {
    name: string;
    stats: Stats
}

export interface CardStats {
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

export type Stats = {
    [key in Rarity]?: CardStats;
};

