import { MongoClient, ServerApiVersion } from 'mongodb';
const MONGODB_URI =  'mongodb+srv://dbInternship:db1234@cluster0.bbkjvav.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
export const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function connectToDatabase() {
  try {
    await client.connect();
    await client.db("Task3").command({ ping: 1 });
    console.log('✅ MongoDB Connected via Native Driver');
    return client;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
}