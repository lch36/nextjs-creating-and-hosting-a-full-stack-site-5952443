
import { MongoClient, Db, ServerApiVersion } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDb() {
    if (cachedClient && cachedDb) {
        return { client: cachedClient, db: cachedDb };
    }

    const uri = process.env.MONGODB_URI;
    const dbName = process.env.MONGODB_DB || "ecommerce-nextjs";

    if (!uri) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
    }
    });

    await client.connect();
    cachedClient = client;
    cachedDb = client.db(dbName); // You can specify the database name here if needed

    return { client, db: client.db(dbName) };
}
