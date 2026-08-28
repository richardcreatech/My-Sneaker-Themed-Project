import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    family: 4
});

try {
    await client.connect();

    console.log("✅ CONNECTED TO POSTGRES");

    const result = await client.query("SELECT NOW()");

    console.log(result.rows);

} catch (error) {
    console.error("❌ DATABASE ERROR");
    console.error(error);

} finally {
    await client.end();
}