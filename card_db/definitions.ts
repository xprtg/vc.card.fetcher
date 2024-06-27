import sr_cards from "./SR/sr_card_names";

type CARD_LIBRARY_TYPE = { [key in CardRarity]?: CardLibrary };

export enum Elements {
    Cool = "Cool",
    Dark = "Dark",
    Light = "Light",
    Passion = "Passion",
    Special = "Special"
}

export type CardRarity = "N" | "R" | "S" | "GSR" | "XSR" | "UR" | "GUR" | "XUR" | "LR" | "GLR" | "XLR" | "VR" | "GVR" | "XVR";

export class CardLibrary {
    rarity: CardRarity;
    element: Elements;
    library: string[];

    constructor(rarity: CardRarity, element: Elements, library: string[]) {
        this.rarity = rarity;
        this.element = element;
        this.library = library;
    }
}

const CARD_LIBRARY: CARD_LIBRARY_TYPE = {
    S: new CardLibrary("S", Elements.Cool, sr_cards.Cool),
};

export default CARD_LIBRARY;
