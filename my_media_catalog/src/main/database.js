import fs from 'fs'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'users.db')
const isNewDatabase = !fs.existsSync(dbPath)

const db = new Database(dbPath, { verbose: console.log })

if (isNewDatabase) {
  console.log('🆕 Создаётся новая база данных...')
  db.exec(`
    CREATE TABLE IF NOT EXISTS genre (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quality (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS video_codec (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audio_codec (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS subtitles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rus_subtitles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rus_title TEXT,
      original_title TEXT NOT NULL,
      genre_id INTEGER NOT NULL,
      year INTEGER,
      description TEXT,
      country TEXT,
      cast TEXT,
      director TEXT,
      time TEXT CHECK(time LIKE '__:__:__'),
      quality_id INTEGER NOT NULL,
      video_codec_id INTEGER NOT NULL,
      audio_codec_id INTEGER NOT NULL,
      screen_resolution TEXT,
      bit_rate TEXT,
      size TEXT,
      subtitles_id INTEGER NOT NULL,
      rus_subtitles_id INTEGER NOT NULL,
      audio_streams TEXT NOT NULL,
      path TEXT NOT NULL,
      image BLOB,
      created_at DATE DEFAULT CURRENT_TIMESTAMP,
      last_updated DATE DEFAULT CURRENT_TIMESTAMP,
      rating INTEGER CHECK (rating >= 0 AND rating <= 10),
      FOREIGN KEY (genre_id) REFERENCES genre(id),
      FOREIGN KEY (quality_id) REFERENCES quality(id),
      FOREIGN KEY (video_codec_id) REFERENCES video_codec(id),
      FOREIGN KEY (audio_codec_id) REFERENCES audio_codec(id),
      FOREIGN KEY (subtitles_id) REFERENCES subtitles(id),
      FOREIGN KEY (rus_subtitles_id) REFERENCES rus_subtitles(id)
    );

    CREATE TRIGGER update_last_updated
    AFTER UPDATE ON movies
    FOR EACH ROW
    BEGIN
      UPDATE movies SET last_updated = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;

    INSERT OR IGNORE INTO genre (name) VALUES ('боевик');
    INSERT OR IGNORE INTO genre (name) VALUES ('драма');
    INSERT OR IGNORE INTO genre (name) VALUES ('комедия');
    INSERT OR IGNORE INTO genre (name) VALUES ('ужасы');
    INSERT OR IGNORE INTO genre (name) VALUES ('триллер');
    INSERT OR IGNORE INTO genre (name) VALUES ('мистика');
    INSERT OR IGNORE INTO genre (name) VALUES ('немое кино');
    INSERT OR IGNORE INTO genre (name) VALUES ('вестерн');
    INSERT OR IGNORE INTO genre (name) VALUES ('документальное');
    INSERT OR IGNORE INTO genre (name) VALUES ('историческое');
    INSERT OR IGNORE INTO genre (name) VALUES ('биография');
    INSERT OR IGNORE INTO genre (name) VALUES ('короткометражное кино');

    INSERT OR IGNORE INTO quality (name) VALUES ('BD Remux');
    INSERT OR IGNORE INTO quality (name) VALUES ('BD Rip');
    INSERT OR IGNORE INTO quality (name) VALUES ('Screen');
    INSERT OR IGNORE INTO quality (name) VALUES ('DVD');
    INSERT OR IGNORE INTO quality (name) VALUES ('Blu-Ray');
    INSERT OR IGNORE INTO quality (name) VALUES ('HD-DVD');
    INSERT OR IGNORE INTO quality (name) VALUES ('Web-DL');
    INSERT OR IGNORE INTO quality (name) VALUES ('HDTV');
    INSERT OR IGNORE INTO quality (name) VALUES ('HDTV-Rip');
    INSERT OR IGNORE INTO quality (name) VALUES ('VHS');
    INSERT OR IGNORE INTO quality (name) VALUES ('Не указано');

    INSERT OR IGNORE INTO video_codec (name) VALUES ('H.264');
    INSERT OR IGNORE INTO video_codec (name) VALUES ('H.265');
    INSERT OR IGNORE INTO video_codec (name) VALUES ('MPEG-4');
    INSERT OR IGNORE INTO video_codec (name) VALUES ('MPEG-2');
    INSERT OR IGNORE INTO video_codec (name) VALUES ('VP8');
    INSERT OR IGNORE INTO video_codec (name) VALUES ('VP9');
    INSERT OR IGNORE INTO video_codec (name) VALUES ('AV1');
    INSERT OR IGNORE INTO video_codec (name) VALUES ('DivX');
    INSERT OR IGNORE INTO video_codec (name) VALUES ('XviD');

    INSERT OR IGNORE INTO audio_codec (name) VALUES ('AAC');
    INSERT OR IGNORE INTO audio_codec (name) VALUES ('AC3');
    INSERT OR IGNORE INTO audio_codec (name) VALUES ('DTS');
    INSERT OR IGNORE INTO audio_codec (name) VALUES ('Dolby TrueHD');
    INSERT OR IGNORE INTO audio_codec (name) VALUES ('MP3');
    INSERT OR IGNORE INTO audio_codec (name) VALUES ('Opus');
    INSERT OR IGNORE INTO audio_codec (name) VALUES ('Vorbis');
    INSERT OR IGNORE INTO audio_codec (name) VALUES ('FLAC');

    INSERT OR IGNORE INTO subtitles (name) VALUES ('есть');
    INSERT OR IGNORE INTO subtitles (name) VALUES ('нет');
    INSERT OR IGNORE INTO subtitles (name) VALUES ('не указано');

    INSERT OR IGNORE INTO rus_subtitles (name) VALUES ('есть');
    INSERT OR IGNORE INTO rus_subtitles (name) VALUES ('нет');
    INSERT OR IGNORE INTO rus_subtitles (name) VALUES ('не указано');
  `)
  console.log('✅ База данных успешно создана!')
} else {
  console.log('📂 База данных уже существует.')
}

export default db
