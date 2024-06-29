import { CardStats, Rarity } from "../interfaces/Card";
import { removeQueryStringFromUrl } from "./removeQueryStringFromUrl";

/**
 * Updates the image URL in the card stats based on their rarity.
 *
 * @param stats - An array of card stats objects.
 * @returns The card stats with updated image URLs.
 */
export const updateImageUrlsByRarity = (stats: CardStats[]): CardStats[] => {
  const imageLibrary = stats.map(stat => stat.image_url);
  const raritySuffixMap: Record<Rarity, string> = {
    '0✰': '.png',
    '1★': '_H.png',
    "2★": "_2.png",
    "3★": "_3.png",
    "4★": "_4.png",
    'G★': '_H.png',
    'X★': '_X.png',
  };

  stats.forEach(stat => {
    const suffix = raritySuffixMap[stat.rarity];
    if (suffix) {
      const matchedImage = imageLibrary.find(image => image.includes(suffix)) || "";
      stat.image_url = removeQueryStringFromUrl(matchedImage)
    }
  });

  return stats;
};
