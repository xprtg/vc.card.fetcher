import puppeteer from 'puppeteer';

export async function getImageUrls(): Promise<(string | null)[]> {
    try {
        const cardName = "Freshman_Griffin";
        const browserInstance = await puppeteer.launch({ headless: true });
        const page = await browserInstance.newPage();

        await page.goto('https://valkyriecrusade.fandom.com/wiki/' + cardName);

        await page.waitForSelector('img');

        const imageUrls = await page.$$eval('img', (images, cardName) => {
            const validUrls: string[] = [];
            for (const img of images) {
                const src = img.getAttribute('src');
                if (src && src.includes(cardName)) {
                    validUrls.push(src);
                    break; 
                }
            }
            return validUrls;
        }, cardName);

        console.log('Image URL:', imageUrls.length > 0 ? imageUrls[0] : 'No se encontró ninguna imagen.');

        await browserInstance.close();
        return imageUrls;
    } catch (error) {
        console.error('Error retrieving image URLs:', error);
        return [];
    }
}


