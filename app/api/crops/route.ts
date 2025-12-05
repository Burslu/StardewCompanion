import { NextResponse } from 'next/server';
import cropsData from '../../../data/crops.json';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get('season');

    let filteredCrops = cropsData;

    if (season && season !== 'All Seasons') {
        filteredCrops = cropsData.filter((crop: any) => crop.season.includes(season));
    }

    return NextResponse.json(filteredCrops);
}
