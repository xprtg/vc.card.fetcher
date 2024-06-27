import fs from 'fs';
import path from 'path';
import { Card } from '../interfaces/Card';

const OUT_DIR = './generate';

async function ensureDirectoryExists(directory: string) {
    try {
        await fs.promises.mkdir(directory, { recursive: true });
    } catch (error) {
        console.error(`Error creating directory "${directory}":`, error);
        throw error;
    }
}

export async function writeData(card: Card) {
    const fileName = `${card.name}.json`;
    const filePath = path.join(OUT_DIR, fileName);

    try {
        await ensureDirectoryExists(OUT_DIR);
    } catch (error) {
        console.error(`Error ensuring directory "${OUT_DIR}" exists:`, error);
        return;
    }

    try {
        await fs.promises.writeFile(filePath, JSON.stringify(card, null, 2));
        console.log(`File "${fileName}" created successfully in directory "${OUT_DIR}".`);
    } catch (error) {
        console.error(`Error writing file "${fileName}":`, error);
    }
}
