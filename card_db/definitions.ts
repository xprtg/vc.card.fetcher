import fs from 'fs'

const fileBuffer = fs.readFileSync(__dirname + "/card_library.json", 'utf-8')
const data = JSON.parse(fileBuffer) as CARD_LIBRARY_TYPE

type CARD_LIBRARY_TYPE = { [key in CardRarity]?: { [key in Elements]?: CardLibrary } };

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

const CARD_LIBRARY: CARD_LIBRARY_TYPE = data

export default CARD_LIBRARY;
