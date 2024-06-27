import { Page } from 'puppeteer';
import { Stats } from '../interfaces/Card';

export async function getStatsFromPage(page: Page): Promise<Stats> {
    return await page.evaluate(() => {
        const result: Stats = {};
        const cardMobile = document.querySelector('.card-mobile');

        if (cardMobile) {
            const paragraphs = cardMobile.querySelectorAll('p');
            paragraphs.forEach((p) => {
                const textContent = p.innerText.trim();
                if (textContent && !p.classList.contains('mw-empty-elt')) {
                    const lines = textContent.split('\n');
                    let starKey: string | undefined;
                    const statObject: { [key: string]: any; } = {};

                    lines.forEach((line) => {
                        const match = line.match(/^(.*?):\s*(.*)$/);
                        if (match) {
                            const key = match[1].trim();
                            const value = match[2].trim();

                            if (key.includes('Max Level')) {
                                starKey = key.split(' ')[0]; // Extract star rating (e.g., "0✰", "1★")
                                statObject['Max Level'] = parseInt(value, 10);
                            } else if (key.includes('Cost')) {
                                statObject['Cost'] = parseInt(value, 10);
                            } else if (key.includes('Attack')) {
                                const [start, end] = value.split(' / ').map(Number);
                                statObject['Attack'] = [start, end];
                            } else if (key.includes('Defense')) {
                                const [start, end] = value.split(' / ').map(Number);
                                statObject['Defense'] = [start, end];
                            } else if (key.includes('Soldiers')) {
                                const [start, end] = value.split(' / ').map(Number);
                                statObject['Soldiers'] = [start, end];
                            }
                        }
                    });

                    if (starKey) {
                        // @ts-ignore
                        result[starKey] = statObject;
                    }
                }
            });
        }

        return result;
    });
}
