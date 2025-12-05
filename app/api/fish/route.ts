import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get('season');
    const location = searchParams.get('location');

    const fish = await prisma.fish.findMany({
        where: {
            ...(season && { season: { contains: season } }),
            ...(location && { location: { contains: location } }),
        },
        orderBy: {
            name: 'asc'
        }
    });

    return NextResponse.json(fish);
}
