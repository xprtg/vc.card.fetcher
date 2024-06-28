import { Page } from 'puppeteer';
import { CardStats, Rarity } from '../interfaces/Card';

// getImageUrls().then(urls => urls.forEach(url => console.log(removeQueryStringFromUrl(url))));

export async function getStatsFromPage(cardName: string, page: Page): Promise<CardStats[]> {
    return await page.evaluate((cardName) => {
        const result: CardStats[] = [];

        const imageResult: string[] = [];
        const images = document.querySelectorAll('img');

        for (const img of images) {
            const src = img.getAttribute('src');
            if (src && src.includes(cardName)) {
                imageResult.push(src);
                break;
            }
        }

        const cardMobile = document.querySelector('.card-mobile');

        if (cardMobile) {
            const paragraphs = cardMobile.querySelectorAll('p');
            paragraphs.forEach((p) => {
                const cardStats: Partial<CardStats> = {};

                const textContent = p.innerText.trim();
                if (textContent && !p.classList.contains('mw-empty-elt')) {
                    const lines = textContent.split('\n');
                    let starKey: Rarity | undefined;

                    lines.forEach((line) => {
                        const match = line.match(/^(.*?):\s*(.*)$/);
                        if (match) {
                            const key = match[1].trim();
                            const value = match[2].trim();

                            if (key.includes('Max Level')) {
                                starKey = key.split(' ')[0] as Rarity;
                                cardStats['Max Level'] = parseInt(value, 10);
                            } else if (key.includes('Cost')) {
                                cardStats['Cost'] = parseInt(value, 10);
                            } else if (key.includes('Attack')) {
                                const [start, end] = value.split(' / ').map(Number);
                                cardStats['Attack'] = [start, end];
                            } else if (key.includes('Defense')) {
                                const [start, end] = value.split(' / ').map(Number);
                                cardStats['Defense'] = [start, end];
                            } else if (key.includes('Soldiers')) {
                                const [start, end] = value.split(' / ').map(Number);
                                cardStats['Soldiers'] = [start, end];
                            }
                        }
                    });

                    if (starKey && Object.keys(cardStats).length > 0) {
                        result.push({
                            rarity: starKey,
                            "Max Level": cardStats['Max Level'] || 0,
                            Cost: cardStats['Cost'] || 0,
                            Attack: cardStats['Attack'] || [0, 0],
                            Defense: cardStats['Defense'] || [0, 0],
                            Soldiers: cardStats['Soldiers'] || [0, 0],
                            // @ts-ignore
                            image_url: imageResult,
                        });
                    }
                }
            });
        }

        return result;
    }, cardName);
}
