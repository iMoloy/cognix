import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://cognix:yN4eQOoHIsDSobEW@luminatiles.ywlqpnm.mongodb.net/?appName=LuminaTiles";
const dbName = "cognix_db";

const demoUsers = [
  { name: "Admin", email: "admin@cognix.com", password: "password123", role: "admin" },
  { name: "Creator", email: "creator@cognix.com", password: "password123", role: "creator" },
  { name: "Normal User", email: "user@cognix.com", password: "password123", role: "user" }
];

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    // 2. Register via Better Auth API
    for (const u of demoUsers) {
      try {
        const res = await fetch("http://localhost:5000/api/auth/sign-up/email", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Origin": "http://localhost:3000"
          },
          body: JSON.stringify({ name: u.name, email: u.email, password: u.password })
        });
        const data = await res.json();
        if (res.ok) {
          console.log(`Created user ${u.email} successfully.`);
          
          // 3. Update the role in DB
          await db.collection("users").updateOne(
            { email: u.email },
            { $set: { role: u.role, subscription: "premium" } }
          );
          console.log(`Assigned role '${u.role}' to ${u.email}`);
        } else {
          console.error(`Failed to create ${u.email}:`, data);
        }
      } catch (err) {
        console.error(`Fetch error for ${u.email}:`, err.message);
      }
    }
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
