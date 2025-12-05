import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

export async function GET() {
    const bundles = await prisma.bundle.findMany({
        orderBy: { room: 'asc' }
    });

    return NextResponse.json(bundles.map((b: any) => ({
        ...b,
        items: JSON.parse(b.items)
    })));
}
