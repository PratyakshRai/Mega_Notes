---
title: MongoDB
category: Backend
topic: MongoDB
difficulty: Beginner
description: MongoDB is a document-oriented NoSQL database that stores data in flexible, JSON-like BSON documents.
tags:
  - backend
  - mongodb
  - nosql
  - database
  - documents
order: 7
---

## What is MongoDB?

MongoDB is a **document-oriented NoSQL** database. Instead of rows in tables, data is stored in **documents** (BSON — Binary JSON) inside **collections**.

## SQL vs MongoDB Concepts

| SQL | MongoDB |
|-----|---------|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| JOIN | `$lookup` / embedding |
| Primary Key | `_id` (ObjectId) |

## Basic CRUD Operations

```javascript
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGO_URI);
const db = client.db('myapp');
const users = db.collection('users');

// Create
await users.insertOne({ name: 'Alice', age: 30, tags: ['admin'] });

// Read
const user = await users.findOne({ name: 'Alice' });
const allAdmins = await users.find({ tags: 'admin' }).toArray();

// Update
await users.updateOne({ name: 'Alice' }, { $set: { age: 31 } });

// Delete
await users.deleteOne({ name: 'Alice' });
```

:::revision
- MongoDB stores BSON documents in collections (no fixed schema).
- `_id` is automatically added as a unique ObjectId.
- Use `$set`, `$push`, `$pull`, `$inc` for updates.
- Embed related data for read-heavy use cases; reference for write-heavy.
- Create indexes on frequently queried fields for performance.
:::
