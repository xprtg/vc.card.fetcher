import { createCard } from './helpers/makeCard';
import { Card, CardStats } from "./interfaces/Card";
import { checkIfCardExists, writeData } from './helpers/writeData';
import CARD_LIBRARY, { CardLibrary, CardRarity, Elements } from './card_db/definitions';
import { scrapeData } from './helpers/scrapeData';

async function scrapeSequentiallyAndWriteData({ library }: { library: CardLibrary }): Promise<void> {
    try {
        for (const cardName of library.library) {
            console.log({ processing: cardName })

            const exists = await checkIfCardExists({
                name: cardName,
                rarity: library.rarity,
                element: library.element
            })

            if (exists) {
                continue;
            }

            const stats: CardStats[] = await scrapeData(cardName);
            const card: Card = createCard({
                name: cardName,
                element: library.element,
                rarity: library.rarity,
                stats: stats
            });
            await writeData(card);
        }
    } catch (error) {
        console.error('Error during scraping and writing:', error);
    }
}

scrapeSequentiallyAndWriteData({
    library: CARD_LIBRARY.S!
}).then(() => {
    console.log('All data has been scraped and written successfully.');
}).catch((error: any) => {
    console.error('General error:', error);
}).finally(process.exit)
