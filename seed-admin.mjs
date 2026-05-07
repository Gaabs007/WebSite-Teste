import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/mysql2';
import { users } from './drizzle/schema.js';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
const PASSWORD = process.env.OWNER_PASSWORD;

async function seedAdmin() {
  try {
    // Create connection
    const connection = await mysql.createConnection(DATABASE_URL);
    const db = drizzle(connection);

    // Hash password
    const hashedPassword = await bcrypt.hash(PASSWORD, 10);

    // Create admin user
    await db.insert(users).values({
      username: 'admin',
      passwordHash: hashedPassword,
      name: 'Administrador',
      email: 'admin@saberes-indigenas.com',
      role: 'admin',
    });
    
    await connection.end();
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
