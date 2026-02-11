import { NextResponse } from 'next/server';
import db, { getAllCards, getCultures, getCardTypes } from '@/lib/db';

export async function GET() {
  try {
    const cards = getAllCards();
    const cultures = getCultures();
    const cardTypes = getCardTypes();
    
    return NextResponse.json({
      cards,
      cultures,
      cardTypes,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      culture_id,
      card_type_id,
      twilight_cost,
      strength,
      vitality,
      game_text,
      flavor_text,
      keywords,
      is_unique,
      set_name,
      rarity,
    } = body;

    const result = db.prepare(`
      INSERT INTO cards (
        name, culture_id, card_type_id, twilight_cost, strength, vitality,
        game_text, flavor_text, keywords, is_unique, set_name, rarity
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      culture_id,
      card_type_id,
      twilight_cost || 0,
      strength,
      vitality,
      game_text,
      flavor_text,
      keywords ? JSON.stringify(keywords) : null,
      is_unique ? 1 : 0,
      set_name,
      rarity
    );

    return NextResponse.json({
      id: result.lastInsertRowid,
      message: 'Card created successfully',
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create card' },
      { status: 500 }
    );
  }
}
