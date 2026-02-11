import { NextResponse } from 'next/server';
import db, { createDeck, getDeckById } from '@/lib/db';

export async function GET() {
  try {
    const decks = db.prepare(`
      SELECT d.*, 
             COUNT(dc.id) as card_count
      FROM decks d
      LEFT JOIN deck_cards dc ON d.id = dc.deck_id
      GROUP BY d.id
      ORDER BY d.updated_at DESC
    `).all();
    
    return NextResponse.json({ decks });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch decks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, player_id, description } = body;

    const result = db.prepare(`
      INSERT INTO decks (name, player_id, description) VALUES (?, ?, ?)
    `).run(name, player_id || null, description || null);

    return NextResponse.json({
      id: result.lastInsertRowid,
      message: 'Deck created successfully',
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create deck' },
      { status: 500 }
    );
  }
}
