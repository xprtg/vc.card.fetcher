import puppeteer, { Browser } from 'puppeteer';
import { CardStats } from "./interfaces/Card";
import { getStatsFromPage } from './helpers/getStatsFromPage';

let browserInstance: Browser | null = null;
export async function scrapeData(name: string): Promise<CardStats[]> {
    try {
        if (!browserInstance) {
            browserInstance = await puppeteer.launch();
        }
        const url = `https://valkyriecrusade.fandom.com/wiki/${name}`;
        const page = await browserInstance.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const stats = await getStatsFromPage(page);

        return stats;
    } catch (error) {
        console.error(`Error scraping ${name}:`, error);
        throw error;
    }
}
