import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI!;

if (!uri) {
  throw new Error("MONGO_URI is not defined");
}

const options = {};

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(uri, options);
}

const db = client.db();

export { client, db };
