import * as fs from 'fs/promises';
import * as path from 'path';
import { Card } from './interfaces/Card';

const mainFolder = './generated';
const rarities = ['LR', 'N', 'R', 'UR', 'VR'];
const elements = ['Cool', 'Dark', 'Light', 'Passion', 'Special'];

async function readJsonFiles() {
    try {
        for (const rarity of rarities) {
            const rarityPath = path.join(mainFolder, rarity);
            for (const element of elements) {
                const elementPath = path.join(rarityPath, element);
                try {
                    const files = await fs.readdir(elementPath);
                    for (const file of files) {
                        if (file.endsWith('.json')) {
                            const filePath = path.join(elementPath, file);
                            const data = await fs.readFile(filePath, 'utf-8');
                            const json = JSON.parse(data) as Card;
                            await asyncOperation(json);
                        }
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
    } catch (err) {
        console.error(`Error reading main folder ${mainFolder}:`, err);
    }
}

async function asyncOperation(json: Card) {
    console.log({ uploading_card: json.name });
    const API_URL = "http://localhost:4000/cards";

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
    } else {
        console.log({ card_uploaded: true })
    }

    const data = await fresponse.json();
    return data;
}
readJsonFiles().then(() => {
    console.log('Finished reading JSON files.');
}).catch(err => {
    console.error('Error in readJsonFiles:', err);
});
