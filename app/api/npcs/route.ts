import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (name) {
        const npc = await prisma.npc.findUnique({
            where: { name }
        });

        if (!npc) {
            return NextResponse.json({ error: 'NPC not found' }, { status: 404 });
        }

        return NextResponse.json({
            ...npc,
            loves: JSON.parse(npc.loves),
            likes: JSON.parse(npc.likes),
            hates: JSON.parse(npc.hates),
        });
    }

    const npcs = await prisma.npc.findMany({
        orderBy: {
            name: 'asc'
        }
    });

    const npcsWithParsedData = npcs.map((npc: any) => ({
        ...npc,
        loves: JSON.parse(npc.loves),
        likes: JSON.parse(npc.likes),
        hates: JSON.parse(npc.hates),
    }));

    return NextResponse.json(npcsWithParsedData);
}
