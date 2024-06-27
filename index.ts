import puppeteer, { Browser } from 'puppeteer';
import { createCard } from './helpers/makeCard';
import { Card } from "./interfaces/Card";
import { writeData } from './helpers/writeData';
import { getStatsFromPage } from './helpers/getStatsFromPage';

let browserInstance: Browser | null = null;

async function scrapeData(name: string): Promise<Card> {
    try {
        if (!browserInstance) {
            browserInstance = await puppeteer.launch();
        }
        const url = `https://valkyriecrusade.fandom.com/wiki/${name}`;
        const page = await browserInstance.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const stats = await getStatsFromPage(page);

        const card: Card = createCard({
            name: name,
            stats: stats
        });

        return card;
    } catch (error) {
        console.error(`Error scraping ${name}:`, error);
        throw error;
    }
}

async function scrapeSequentiallyAndWriteData(names: string[]): Promise<void> {
    try {
        for (const name of names) {
            const card: Card = await scrapeData(name);
            await writeData(card);
        }
    } catch (error) {
        console.error('Error during scraping and writing:', error);
    }
}

const nameCardsToFetch: string[] = ['Acupuncturist', 'Aero'];

scrapeSequentiallyAndWriteData(nameCardsToFetch).then(() => {
    console.log('All data has been scraped and written successfully.');
}).catch((error: any) => {
    console.error('General error:', error);
}).finally(process.exit)
