import { createCard } from './helpers/makeCard';
import { Card, CardStats, Rarity } from "./interfaces/Card";
import { checkIfCardExists, writeData } from './helpers/writeData';
import CARD_LIBRARY, { CardLibrary, CardRarity, Elements } from './card_db/definitions';
import { scrapeData } from './helpers/scrapeData';

async function scrapeSequentiallyAndWriteData({ library }: { library: CardLibrary }): Promise<void> {
    try {
        let index = 0
        for (const cardName of library.library) {
            const exists = await checkIfCardExists({
                name: cardName,
                rarity: library.rarity,
                element: library.element
            })

            if (exists) {
                console.log({ already_in_storage: cardName })
                continue;
            }
            console.log({ processing: cardName, left: library.library.length - index })

            const stats: CardStats[] = await scrapeData(cardName);
            const card: Card = createCard({
                name: cardName,
                element: library.element,
                rarity: library.rarity,
                stats: stats
            });
            await writeData(card);
            index++
        }
    } catch (error) {
        console.error('Error during scraping and writing:', error);
    }
}

// @ts-ignore
Object.keys(CARD_LIBRARY).map(async (rarity: CardRarity) => {
    for (const element in CARD_LIBRARY[rarity]) {
        // @ts-ignore
        const library: CardLibrary = CARD_LIBRARY[rarity][element]
        console.log("processing:", library.rarity, library.element, library.library.length)
        try {
            await scrapeSequentiallyAndWriteData({ library })
        } catch (error) {
            console.error('Error: ', error)
        }
    }
})
