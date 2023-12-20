const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();

    const database = client.db('HotelPereMaria');
    // Check database existence
    const dbList = await client.db().admin().listDatabases();
    const databaseExists = dbList.databases.some(db => db.name === 'HotelPereMaria');
    console.log('Database exists:', databaseExists);



    const collection = database.collection('users');
    // Check collection existence
    const collections = await database.listCollections({ name: 'users' }).toArray();
    const collectionExists = collections.length > 0;
    console.log('Collection exists:', collectionExists);
    //debugger
    const users = await collection.find({}).toArray();

    await client.close();

    res.json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/users/:email', async (req, res) => {
  const userEmail = req.params.email;

  try {
    const client = new MongoClient(MONGO_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    await client.connect();

    const database = client.db('HotelPereMaria');
    const collection = database.collection('users');

    const user = await collection.findOne({ email: userEmail });

    await client.close();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
