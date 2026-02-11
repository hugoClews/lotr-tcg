import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'game.db');

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize tables
db.exec(`
  -- Card cultures/factions
  CREATE TABLE IF NOT EXISTS cultures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    symbol TEXT,
    color TEXT,
    side TEXT CHECK(side IN ('free_peoples', 'shadow')) NOT NULL
  );

  -- Card types
  CREATE TABLE IF NOT EXISTS card_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
  );

  -- Cards master table
  CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    culture_id INTEGER REFERENCES cultures(id),
    card_type_id INTEGER REFERENCES card_types(id),
    twilight_cost INTEGER DEFAULT 0,
    strength INTEGER,
    vitality INTEGER,
    site_number INTEGER,
    shadow_number INTEGER,
    resistance INTEGER,
    game_text TEXT,
    flavor_text TEXT,
    keywords TEXT, -- JSON array
    is_unique BOOLEAN DEFAULT 0,
    set_name TEXT,
    set_number TEXT,
    rarity TEXT CHECK(rarity IN ('C', 'U', 'R', 'P', 'S')),
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Decks
  CREATE TABLE IF NOT EXISTS decks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    player_id INTEGER,
    ring_bearer_id INTEGER REFERENCES cards(id),
    ring_id INTEGER REFERENCES cards(id),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Deck cards (many-to-many)
  CREATE TABLE IF NOT EXISTS deck_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_id INTEGER REFERENCES decks(id) ON DELETE CASCADE,
    card_id INTEGER REFERENCES cards(id),
    quantity INTEGER DEFAULT 1,
    section TEXT CHECK(section IN ('free_peoples', 'shadow', 'sites')) NOT NULL
  );

  -- Game sessions
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1_id INTEGER,
    player2_id INTEGER,
    player1_deck_id INTEGER REFERENCES decks(id),
    player2_deck_id INTEGER REFERENCES decks(id),
    status TEXT CHECK(status IN ('waiting', 'active', 'finished', 'abandoned')) DEFAULT 'waiting',
    winner_id INTEGER,
    current_site INTEGER DEFAULT 1,
    current_phase TEXT,
    twilight_pool INTEGER DEFAULT 0,
    turn_number INTEGER DEFAULT 1,
    active_player INTEGER,
    game_state TEXT, -- JSON blob for full state
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    finished_at DATETIME
  );

  -- Game log/history
  CREATE TABLE IF NOT EXISTS game_actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    player_id INTEGER,
    action_type TEXT NOT NULL,
    action_data TEXT, -- JSON
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Players
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT UNIQUE,
    password_hash TEXT,
    rating INTEGER DEFAULT 1000,
    games_played INTEGER DEFAULT 0,
    games_won INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data
const culturesExist = db.prepare('SELECT COUNT(*) as count FROM cultures').get() as { count: number };
if (culturesExist.count === 0) {
  const insertCulture = db.prepare(`
    INSERT INTO cultures (name, symbol, color, side) VALUES (?, ?, ?, ?)
  `);

  const cultures = [
    // Free Peoples
    ['Dwarven', '⚒️', '#8B4513', 'free_peoples'],
    ['Elven', '🌿', '#4169E1', 'free_peoples'],
    ['Gandalf', '🌟', '#808080', 'free_peoples'],
    ['Gondor', '🌳', '#FFFFFF', 'free_peoples'],
    ['Rohan', '🐎', '#FFD700', 'free_peoples'],
    ['Shire', '🏠', '#228B22', 'free_peoples'],
    // Shadow
    ['Dunland', '🔥', '#FF4500', 'shadow'],
    ['Isengard', '⚙️', '#000000', 'shadow'],
    ['Moria', '⛏️', '#8B0000', 'shadow'],
    ['Ringwraith', '👁️', '#4B0082', 'shadow'],
    ['Sauron', '🗼', '#DC143C', 'shadow'],
  ];

  for (const [name, symbol, color, side] of cultures) {
    insertCulture.run(name, symbol, color, side);
  }

  // Seed card types
  const insertType = db.prepare(`
    INSERT INTO card_types (name, description) VALUES (?, ?)
  `);

  const types = [
    ['Companion', 'Free Peoples character that travels with the Ring-bearer'],
    ['Ally', 'Free Peoples character that stays at a specific site'],
    ['Minion', 'Shadow character used to oppose the Fellowship'],
    ['Event', 'One-time effect card'],
    ['Condition', 'Ongoing effect that attaches to cards or remains in support area'],
    ['Possession', 'Item that attaches to a character'],
    ['Artifact', 'Unique powerful item'],
    ['Site', 'Location on the adventure path'],
    ['The One Ring', 'The Ring card carried by the Ring-bearer'],
  ];

  for (const [name, description] of types) {
    insertType.run(name, description);
  }
}

export default db;

// Helper functions
export function getAllCards() {
  return db.prepare(`
    SELECT c.*, cu.name as culture_name, ct.name as type_name 
    FROM cards c
    LEFT JOIN cultures cu ON c.culture_id = cu.id
    LEFT JOIN card_types ct ON c.card_type_id = ct.id
  `).all();
}

export function getCardById(id: number) {
  return db.prepare(`
    SELECT c.*, cu.name as culture_name, ct.name as type_name 
    FROM cards c
    LEFT JOIN cultures cu ON c.culture_id = cu.id
    LEFT JOIN card_types ct ON c.card_type_id = ct.id
    WHERE c.id = ?
  `).get(id);
}

export function getCultures() {
  return db.prepare('SELECT * FROM cultures').all();
}

export function getCardTypes() {
  return db.prepare('SELECT * FROM card_types').all();
}

export function createDeck(name: string, playerId?: number) {
  const result = db.prepare(`
    INSERT INTO decks (name, player_id) VALUES (?, ?)
  `).run(name, playerId || null);
  return result.lastInsertRowid;
}

export function getDeckById(id: number) {
  return db.prepare(`
    SELECT d.*, 
           json_group_array(json_object(
             'card_id', dc.card_id,
             'quantity', dc.quantity,
             'section', dc.section
           )) as cards
    FROM decks d
    LEFT JOIN deck_cards dc ON d.id = dc.deck_id
    WHERE d.id = ?
    GROUP BY d.id
  `).get(id);
}
