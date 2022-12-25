import { MongoClient } from "mongodb"
import mongoose from "mongoose";

const uri = `${process.env.DATABASE_URL}`
const dbName = `${process.env.DATABASE_NAME}`

const client = new MongoClient(uri)

async function connect() {
    await client.connect()
    const database = client.db(dbName)
    return { database, client }
}

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return mongoose.connections[0]
    }
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    conn.connection.useDb(process.env.DATABASE_NAME)
    return conn
};

export { connect, connectDB }