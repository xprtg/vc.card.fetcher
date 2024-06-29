import puppeteer, { Browser } from 'puppeteer';
import { CardStats } from "../interfaces/Card";
import { getStatsFromPage } from './getStatsFromPage';
import { updateImageUrlsByRarity } from './updateImageUrlsByRarity';

let browserInstance: Browser | null = null;

export async function scrapeData(name: string): Promise<CardStats[]> {
  try {
    if (!browserInstance) {
      browserInstance = await puppeteer.launch({ headless: true });
    }

    const page = await browserInstance.newPage();

    await page.goto(`https://valkyriecrusade.fandom.com/wiki/${name}`, {
      waitUntil: 'domcontentloaded'
    });

    await page.setJavaScriptEnabled(false);

    await page.setCacheEnabled(false);

    const stats = await getStatsFromPage(name, page);

    await page.close();

    const statsWithImage = updateImageUrlsByRarity(stats)

    return statsWithImage;
  } catch (error) {
    console.error(`Error scraping ${name}:`, error);
    throw error;
  } finally {
    // Consider closing the browser if scraping is infrequent or resource usage is critical
    // if (!cluster.isWorker) { // For non-clustered scenarios
    //   await browserInstance?.close();
    //   browserInstance = null;
    // }
  }
}
