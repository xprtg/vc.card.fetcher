import * as fs from 'fs/promises';
import * as path from 'path';
import { Card } from './interfaces/Card';
import { CardRarity } from './card_db/definitions';

const mainFolder = './generated';
const rarities: CardRarity[] = ["N", "R", "SR", "UR", "LR", "VR"];
const elements = ['Cool', 'Dark', 'Light', 'Passion', 'Special'];
const MAX_CONCURRENT_REQUESTS = 5; // Adjust as needed for your environment

async function readJsonFiles() {
    try {
        const cardPromises: Promise<void>[] = [];

        for (const rarity of rarities) {
            const rarityPath = path.join(mainFolder, rarity);
            for (const element of elements) {
                const elementPath = path.join(rarityPath, element);

                try {
                    const files = await fs.readdir(elementPath);

                    const filePromises = files
                        .filter(file => file.endsWith('.json'))
                        .map(async (file) => {
                            const filePath = path.join(elementPath, file);
                            const data = await fs.readFile(filePath, 'utf-8');
                            const json = JSON.parse(data) as Card;

                            await uploadCard(json); // Call uploadCard directly to avoid unnecessary promise creation
                        });

                    // Limit concurrent requests using Promise.all settled
                    const settledResults = await Promise.allSettled(filePromises.slice(0, MAX_CONCURRENT_REQUESTS));

                    // Handle errors and continue with remaining requests
                    for (const result of settledResults) {
                        if (result.status === 'rejected') {
                            console.error('Error uploading card:', result.reason);
                        }
                    }

                    // Process remaining requests if needed (optional)
                    if (filePromises.length > MAX_CONCURRENT_REQUESTS) {
                        const remainingPromises = filePromises.slice(MAX_CONCURRENT_REQUESTS);
                        await Promise.all(remainingPromises);
                    }
                } catch (err: any) {
                    if (err.code !== 'ENOENT') {
                        console.error(`Error reading directory ${elementPath}:`, err);
                    } else {
                        console.warn(`Directory does not exist: ${elementPath}`);
                    }
                }
            }
        }

        await Promise.all(cardPromises); // Wait for all upload promises to complete
        console.log('Finished uploading JSON files.');
    } catch (err) {
        console.error('Error in readJsonFiles:', err);
    }
}

async function uploadCard(json: Card) {
    console.log({ uploading_card: json.name });
    const API_URL = "http://localhost:4000/cards";

    try {
        const fresponse = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(json)
        });

        if (!fresponse.ok) {
            const errorText = await fresponse.text();
            throw new Error(`Error while posting card: ${fresponse.status} ${fresponse.statusText} - ${errorText}`);
        }

        console.log({ card_uploaded: true });
        return await fresponse.json();
    } catch (err) {
        console.error('Error uploading card:', err);
    }
}

readJsonFiles();
