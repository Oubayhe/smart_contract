import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();

export default defineConfig({
    dialect: 'postgresql',
    schema: 'src/db/schemas/*',
    out: 'drizzle',
    dbCredentials: {
        url: `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_LOCALHOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    },
});
