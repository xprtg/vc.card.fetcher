import puppeteer from 'puppeteer';
import { createCard } from './helpers/makeCard';
import { Card } from "./interfaces/Card";
import { writeData } from './helpers/writeData';
import { getStatsFromPage } from './helpers/getStatsFromPage';

async function scrapeData(): Promise<Card> {
    const url = 'https://valkyriecrusade.fandom.com/wiki/Akizu';
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const stats = await getStatsFromPage(page)

    const card: Card = createCard({
        name: 'Akizu',
        stats: stats
    })

    await browser.close();
    return card;
}

scrapeData().then((card: Card) => {
    writeData(card)
}).catch((error) => {
    console.error('Error:', error);
});
