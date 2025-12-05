import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import fs from 'fs/promises';
import path from 'path';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function seedNPCs() {
    console.log('🎁 Seeding NPCs...');
    await prisma.npc.deleteMany();

    const npcsData = JSON.parse(
        await fs.readFile(path.join(process.cwd(), 'data/npcs.json'), 'utf-8')
    );

    for (const npc of npcsData) {
        await prisma.npc.create({
            data: {
                name: npc.name,
                birthday: npc.birthday,
                location: npc.location,
                loves: JSON.stringify(npc.loves),
                likes: JSON.stringify(npc.likes),
                hates: JSON.stringify(npc.hates),
                image: npc.image,
            },
        });
    }

    console.log(`✅ Seeded ${npcsData.length} NPCs`);
}

seedNPCs()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
