import { Pool } from 'pg';

export interface User {
  id: string;
  email: string;
  password: string;
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, 
    },
});
  
export async function getEntries(user_id: number) {
  try {
    const client = await pool.connect();
    const res = await client.query(`SELECT * FROM sleepjournal.entries WHERE user_id = ${user_id}`);
    client.release();
    return res.rows;
  } catch (error) {
    console.error('Error fetching entries:', error);
    throw new Error('Failed to fetch data');
  }
}

export async function getEntryById(entry_id: number) {
  try {
    const client = await pool.connect();
    const res = await client.query(`SELECT * FROM sleepjournal.entries WHERE entry_id = ${entry_id}`);
    client.release();
    return res.rows;
  } catch (error) {
    console.error('Error fetching entries:', error);
    throw new Error('Failed to fetch data');
  }
}

export async function getUserInfo(user_id: number) {
  try {
    const client = await pool.connect();
    const res = await client.query(`SELECT user_id, first_name, last_name, email FROM sleepjournal.users WHERE user_id = ${user_id}`);
    client.release();
    return res.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch data');
  }
}

export async function createUser(first_name: string, last_name: string, email: string, password: string) {
  try {
    const client = await pool.connect();
    const res = await client.query(`INSERT INTO sleepjournal.users (first_name, last_name, email, password) VALUES (${first_name}, ${last_name}, ${email}, ${password}`);
    client.release();
    return res.rows;
  } catch (error) {
    console.error('Error adding users:', error);
    throw new Error('Failed to add user.');
  }
}

export async function getUserbyEmail(email: string): Promise<User> {
  try {
    const client = await pool.connect();
    const res = await client.query(`SELECT user_id AS id, email, password FROM sleepjournal.users WHERE email = '${email}'`);
    client.release();
    return res.rows[0] as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('This user does not exist.');
  }
}
