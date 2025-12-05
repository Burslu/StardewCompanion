import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import fs from 'fs/promises';
import path from 'path';

const libsql = createClient({
    url: 'file:./dev.db'
});

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await prisma.crop.deleteMany();
    await prisma.fish.deleteMany();
    await prisma.recipe.deleteMany();
    await prisma.miningLocation.deleteMany();
    console.log('✅ Cleared existing data');

    // Load crops
    const cropsData = JSON.parse(
        await fs.readFile(path.join(process.cwd(), 'data/crops.json'), 'utf-8')
    );

    for (const crop of cropsData) {
        await prisma.crop.create({
            data: {
                name: crop.name,
                description: crop.description || '',
                season: crop.season,
                growthTime: crop.growthTime,
                regrowthTime: crop.regrowthTime,
                sellPrice: crop.sellPrice,
                seedPrice: crop.seedPrice,
                image: crop.image,
            },
        });
    }
    console.log(`✅ Seeded ${cropsData.length} crops`);

    // Load fish
    const fishData = JSON.parse(
        await fs.readFile(path.join(process.cwd(), 'data/fish.json'), 'utf-8')
    );

    // Clean fish data (the scraped data has messy HTML)
    const cleanFish = fishData
        .filter((f: any) => f.name && f.description)
        .map((f: any) => ({
            name: f.name,
            description: f.description,
            season: f.season || 'All',
            weather: f.weather || 'Any',
            location: f.location || 'Ocean',
            time: f.time || 'Any',
            difficulty: 50, // Default difficulty
            image: f.image,
        }));

    for (const fish of cleanFish) {
        await prisma.fish.create({
            data: fish,
        });
    }
    console.log(`✅ Seeded ${cleanFish.length} fish`);

    // Load recipes
    const recipesData = JSON.parse(
        await fs.readFile(path.join(process.cwd(), 'data/recipes.json'), 'utf-8')
    );

    for (const recipe of recipesData) {
        await prisma.recipe.create({
            data: {
                name: recipe.name,
                description: recipe.category || '',
                ingredients: JSON.stringify(recipe.ingredients),
                buffs: recipe.buffs ? JSON.stringify(recipe.buffs) : null,
                source: recipe.source,
                image: recipe.image || null,
            },
        });
    }
    console.log(`✅ Seeded ${recipesData.length} recipes`);

    // Load mining locations
    const miningData = JSON.parse(
        await fs.readFile(path.join(process.cwd(), 'data/mining.json'), 'utf-8')
    );

    for (const location of miningData) {
        await prisma.miningLocation.create({
            data: {
                location: location.location,
                description: location.description,
                floors: location.floors,
                sections: JSON.stringify(location.sections),
            },
        });
    }
    console.log(`✅ Seeded ${miningData.length} mining locations`);

    console.log('🎉 Database seeding complete!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
