import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI!;

async function resetTrials() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db();

    const result = await db
      .collection("user")
      .updateMany(
        {},
        { $set: { freeTrials: 7, freeTrialResetAt: new Date(0) } },
      );

    console.log(`Updated ${result.modifiedCount} users`);
    console.log(`Matched ${result.matchedCount} users`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

resetTrials();
