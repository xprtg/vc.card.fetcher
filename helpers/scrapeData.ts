import puppeteer, { Browser } from 'puppeteer';
import { CardStats } from "../interfaces/Card";
import { getStatsFromPage } from './getStatsFromPage';

// Consider using a cluster module for parallel scraping (if applicable)
// const cluster = require('cluster');

let browserInstance: Browser | null = null;

export async function scrapeData(name: string): Promise<CardStats[]> {
  try {
    // Reuse existing browser if possible for efficiency
    if (!browserInstance) {
      browserInstance = await puppeteer.launch({ headless: true }); // Adjust headless based on your needs
    }

    const page = await browserInstance.newPage();

    // Optimize network wait strategy based on resource type
    await page.goto(`https://valkyriecrusade.fandom.com/wiki/${name}`, {
      waitUntil: 'domcontentloaded' // Adjust if specific resources are essential
    });

    // Selectively disable unnecessary features (consider performance impact)
    await page.setJavaScriptEnabled(false); // Experiment to see if relevant

    // Optionally reduce memory footprint by disabling cache (evaluate impact)
    // await page.setCacheEnabled(false);

    const stats = await getStatsFromPage(page);

    // Close the page promptly to release resources
    await page.close();

    return stats;
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
