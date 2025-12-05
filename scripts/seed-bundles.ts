import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import fs from 'fs/promises';
import path from 'path';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function seedBundles() {
    console.log('📦 Seeding Bundles...');
    await prisma.bundle.deleteMany();

    const bundlesData = JSON.parse(
        await fs.readFile(path.join(process.cwd(), 'data/bundles.json'), 'utf-8')
    );

    for (const bundle of bundlesData) {
        await prisma.bundle.create({
            data: {
                room: bundle.room,
                name: bundle.name,
                reward: bundle.reward,
                items: JSON.stringify(bundle.items),
            },
        });
    }

    console.log(`✅ Seeded ${bundlesData.length} bundles`);
}

seedBundles()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
