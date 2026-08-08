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
    const res = await client.query(
      `SELECT * FROM sleepjournal.entries WHERE user_id = ${user_id} ORDER BY entry_id DESC`
    );
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
    const res = await client.query(
      `SELECT * FROM sleepjournal.entries WHERE entry_id = ${entry_id} LIMIT 1`
    );
    client.release();
    return res.rows[0] ?? null;
  } catch (error) {
    console.error('Error fetching entries:', error);
    throw new Error('Failed to fetch data');
  }
}

export async function getUserInfo(user_id: number) {
  try {
    const client = await pool.connect();
    const res = await client.query(
      'SELECT user_id, first_name, last_name, email FROM sleepjournal.users WHERE user_id = $1 LIMIT 1',
      [user_id]
    );
    client.release();
    return res.rows[0] ?? null;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch data');
  }
}

export async function updateUser(
  user_id: number,
  first_name: string,
  last_name: string,
  email: string
) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      UPDATE sleepjournal.users
      SET
        first_name = $1,
        last_name = $2,
        email = $3
      WHERE user_id = $4
      RETURNING user_id, first_name, last_name, email
      `,
      [first_name, last_name, email, user_id]
    );

    return result.rows[0] ?? null;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  } finally {
    client.release();
  }
}

export async function getUserForAuth(email: string) {
  try {
    const client = await pool.connect();
    const res = await client.query(
      'SELECT user_id, first_name, last_name, email, password FROM sleepjournal.users WHERE email = $1 LIMIT 1',
      [email]
    );
    client.release();
    return res.rows[0] ?? null;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch data');
  }
}

export async function createUser(first_name: string, last_name: string, email: string, password: string) {
  try {
    const client = await pool.connect();
    const res = await client.query(`INSERT INTO sleepjournal.users (first_name, last_name, email, password) VALUES ('${first_name}', '${last_name}', '${email}', '${password}')`);
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

export async function createEntry(
  user_id: number,
  data: {
    date: string;
    bedtime: string;
    wake_time: string;
    sleep_quality: number | null;
    notes: string | null;
  }
) {

  const client = await pool.connect();


  try {

    const result = await client.query(
      `
      INSERT INTO sleepjournal.entries
      (
        user_id,
        date,
        sleep_time,
        wake_time,
        sleep_quality,
        notes
      )

      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )

      RETURNING *
      `,
      [
        user_id,
        data.date,
        data.bedtime,
        data.wake_time,
        data.sleep_quality,
        data.notes,
      ]
    );


    return result.rows[0];


  } finally {

    client.release();

  }

}

export async function updateEntry(
   entry_id: number,
  entry: {
    bedtime: string;
    wake_time: string;
    sleep_quality: number;
    notes: string;
  },
  user_id: number,
) {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
     UPDATE sleepjournal.entries
SET
    sleep_time = $1,
    wake_time = $2,
    sleep_quality = $3,
    notes = $4
WHERE entry_id = $5
AND user_id = $6
RETURNING *
      `,
      [
        entry.bedtime,
  entry.wake_time,
  entry.sleep_quality,
  entry.notes,
  entry_id,
        user_id,
      ]
    );

    return result.rows[0];

  } catch (error) {
    console.error('Error updating entry:', error);
    throw new Error('Failed to update entry');

  } finally {
    client.release();
  }
}

export async function deleteEntry(
  entry_id: number,
  user_id: number
) {

  const client = await pool.connect();


  try {

    const result = await client.query(
      `
      DELETE FROM sleepjournal.entries
      WHERE entry_id = $1
      AND user_id = $2
      RETURNING entry_id
      `,
      [
        entry_id,
        user_id
      ]
    );


    return result.rowCount !== 0;


  } finally {

    client.release();

  }

}


