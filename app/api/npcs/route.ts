import { NextResponse } from 'next/server';
import npcsData from '../../../data/npcs.json';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (name) {
        const npc = npcsData.find((n: any) => n.name.toLowerCase() === name.toLowerCase());

        if (!npc) {
            return NextResponse.json({ error: 'NPC not found' }, { status: 404 });
        }

        return NextResponse.json(npc);
    }

    // Sort NPCs by name
    const sortedNpcs = [...npcsData].sort((a: any, b: any) => a.name.localeCompare(b.name));

    return NextResponse.json(sortedNpcs);
}
