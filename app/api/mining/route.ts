import { NextResponse } from 'next/server';
import miningData from '../../../data/mining.json';

export async function GET() {
    return NextResponse.json(miningData);
}
