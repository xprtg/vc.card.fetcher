import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { Card } from '../interfaces/Card'; // Asegúrate de importar tus interfaces correctamente

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);

const OUT_DIR = './generate';

async function ensureDirectoryExists(dirPath: string) {
    try {
        await mkdirAsync(dirPath, { recursive: true });
    } catch (error) {
        console.error(`Error ensuring directory "${dirPath}" exists:`, error);
        throw error; // Lanzamos el error para manejarlo fuera de esta función si es necesario
    }
}

export async function writeData(card: Card) {
    const { name, element, rarity } = card;
    const fileName = `${name}.json`;
    const dirPath = path.join(OUT_DIR, rarity, element); // Directorio basado en rarity y element
    const filePath = path.join(dirPath, fileName);

    try {
        await ensureDirectoryExists(dirPath); // Aseguramos que el directorio exista
    } catch (error) {
        console.error(`Error ensuring directory "${dirPath}" exists:`, error);
        return;
    }

    try {
        await writeFileAsync(filePath, JSON.stringify(card, null, 2));
        console.log(`File "${fileName}" created successfully in directory "${dirPath}".`);
    } catch (error) {
        console.error(`Error writing file "${fileName}":`, error);
    }
}
