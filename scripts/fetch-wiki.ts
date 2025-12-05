import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

const BASE_URL = 'https://stardewvalleywiki.com';

async function fetchCrops() {
    console.log('Fetching Crops...');
    const { data } = await axios.get(`${BASE_URL}/Crops`);
    const $ = cheerio.load(data);
    const crops: any[] = [];

    // The wiki structure for crops is complex (headers per season). 
    // We'll look for h3 headers (Seasons) and then the following tables.

    // Simplified scraping strategy: Find all tables with class 'wikitable'
    // This is a heuristic and might need adjustment based on actual HTML structure.
    // A better approach for the wiki: Iterate over h3 (Season) -> Table

    const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

    for (const season of seasons) {
        // Find the header for the season
        const header = $(`h3:contains("${season}")`).first();
        if (header.length) {
            // The table is usually immediately after, or after some text.
            // We look for the next table.
            const table = header.nextAll('table.wikitable').first();

            table.find('tr').each((i, row) => {
                if (i === 0) return; // Skip header

                // This is very specific to the wiki layout and might break.
                // We'll try to grab the name from the first cell.
                const nameCell = $(row).find('td').eq(0);
                const name = nameCell.text().trim().split('\n')[0]; // Handle "Name\n(details)"

                if (!name) return;

                // Image
                const img = nameCell.find('img').attr('src');
                const imageUrl = img ? `${BASE_URL}${img}` : null;

                // Growth Time (usually 2nd col)
                const growthCell = $(row).find('td').eq(1);
                const growthText = growthCell.text().trim();
                const growthTime = parseInt(growthText) || 0;

                // Sell Price (usually has Gold icon)
                // This is tricky, let's just grab text for now.

                if (name && name !== 'Image') {
                    crops.push({
                        name,
                        season,
                        growthTime,
                        image: imageUrl,
                        raw: $(row).text().trim() // Debugging
                    });
                }
            });
        }
    }

    return crops;
}

async function fetchFish() {
    console.log('Fetching Fish...');
    const { data } = await axios.get(`${BASE_URL}/Fish`);
    const $ = cheerio.load(data);
    const fishList: any[] = [];

    // Fish page has a big table for "Fish"
    const table = $('table.wikitable').first(); // The first big table is usually the main fish list

    table.find('tr').each((i, row) => {
        if (i === 0) return;
        const cols = $(row).find('td');
        if (cols.length < 5) return;

        const name = cols.eq(1).text().trim();
        const img = cols.eq(0).find('img').attr('src');
        const description = cols.eq(2).text().trim();
        const price = cols.eq(3).text().trim();
        const location = cols.eq(4).text().trim();
        const time = cols.eq(5).text().trim();
        const season = cols.eq(6).text().trim();
        const weather = cols.eq(7).text().trim();

        if (name) {
            fishList.push({
                name,
                description,
                price,
                location,
                time,
                season,
                weather,
                image: img ? `${BASE_URL}${img}` : null
            });
        }
    });

    return fishList;
}

async function main() {
    try {
        const crops = await fetchCrops();
        await fs.writeFile(path.join(process.cwd(), 'data/crops.json'), JSON.stringify(crops, null, 2));
        console.log(`Saved ${crops.length} crops.`);

        const fish = await fetchFish();
        await fs.writeFile(path.join(process.cwd(), 'data/fish.json'), JSON.stringify(fish, null, 2));
        console.log(`Saved ${fish.length} fish.`);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

main();
