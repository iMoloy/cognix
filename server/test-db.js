import { MongoClient } from 'mongodb';

async function test() {
  const uri = "mongodb+srv://cognix:yN4eQOoHIsDSobEW@luminatiles.ywlqpnm.mongodb.net/?appName=LuminaTiles";
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("cognix_db");
  const prompt = await db.collection("prompts").findOne({});
  console.log("ID Type:", typeof prompt._id);
  console.log("ID Value:", prompt._id);
  await client.close();
}
test();
