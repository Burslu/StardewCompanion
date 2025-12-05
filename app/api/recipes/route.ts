import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

export async function GET() {
    try {
        const recipes = await prisma.recipe.findMany({
            orderBy: {
                name: 'asc',
            },
        });

        // Parse JSON strings back to objects
        const formattedRecipes = recipes.map(recipe => ({
            ...recipe,
            ingredients: JSON.parse(recipe.ingredients),
            buffs: recipe.buffs ? JSON.parse(recipe.buffs) : null,
        }));

        return NextResponse.json(formattedRecipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
    }
}
