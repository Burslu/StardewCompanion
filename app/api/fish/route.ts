import { NextResponse } from 'next/server';
import fishData from '../../../data/fish.json';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get('season');
    const weather = searchParams.get('weather');
    const location = searchParams.get('location');

    let filteredFish = fishData;

    if (season && season !== 'All Seasons') {
        filteredFish = filteredFish.filter((fish: any) => fish.season.includes(season));
    }

    if (weather && weather !== 'Any Weather') {
        filteredFish = filteredFish.filter((fish: any) => fish.weather.includes(weather));
    }

    if (location && location !== 'Any Location') {
        filteredFish = filteredFish.filter((fish: any) => fish.location.includes(location));
    }

    return NextResponse.json(filteredFish);
}
