import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { Card } from '../interfaces/Card'; // Asegúrate de importar tus interfaces correctamente

const writeFileAsync = promisify(fs.writeFile);
const mkdirAsync = promisify(fs.mkdir);
const accessAsync = promisify(fs.access); // Para verificar la existencia de archivos

const OUT_DIR = './generate';

async function ensureDirectoryExists(dirPath: string) {
    try {
        await mkdirAsync(dirPath, { recursive: true });
    } catch (error) {
        console.error(`Error ensuring directory "${dirPath}" exists:`, error);
        throw error;
    }
}

export async function checkIfCardExists({ name, element, rarity }: { name: string, element: string, rarity: string }) {
    const fileName = `${name}.json`;
    const dirPath = path.join(OUT_DIR, rarity, element);
    const filePath = path.join(dirPath, fileName);
    try {
        await accessAsync(filePath, fs.constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}

export async function writeData(card: Card) {
    const { name, element, rarity } = card;
    const fileName = `${name}.json`;
    const dirPath = path.join(OUT_DIR, rarity, element);
    const filePath = path.join(dirPath, fileName);

    try {
        await ensureDirectoryExists(dirPath);
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
