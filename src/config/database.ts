import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg
const pool = new Pool({
  host: process.env.DB_LOCALHOST,
  port: parseInt(process.env["DB_PORT"]!, 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});

export const db = drizzle(pool);

export const checkDbConnection = async (): Promise<void> => {
    try {
      await pool.query('SELECT 1');
      console.log('Connected to the database successfully!');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      throw new Error('Database connection failed');
    }
  };
