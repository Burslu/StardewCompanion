import { NextResponse } from 'next/server';
import recipesData from '../../../data/recipes.json';

export async function GET() {
    // Sort recipes by name
    const sortedRecipes = [...recipesData].sort((a: any, b: any) => a.name.localeCompare(b.name));
    return NextResponse.json(sortedRecipes);
}
