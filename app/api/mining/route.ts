import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

export async function GET() {
    try {
        const locations = await prisma.miningLocation.findMany({
            orderBy: {
                location: 'asc',
            },
        });

        // Parse JSON strings back to objects
        const formattedLocations = locations.map((location: any) => ({
            ...location,
            sections: JSON.parse(location.sections),
        }));

        return NextResponse.json(formattedLocations);
    } catch (error) {
        console.error('Error fetching mining locations:', error);
        return NextResponse.json({ error: 'Failed to fetch mining locations' }, { status: 500 });
    }
}
