---
title: Express.js
category: Backend
topic: Express
difficulty: Beginner
description: Express is a minimal and flexible Node.js web application framework for building APIs and web servers.
tags:
  - backend
  - express
  - nodejs
  - framework
  - api
order: 3
---

## What is Express?

Express is a fast, unopinionated, minimalist **web framework for Node.js**. It provides a robust set of features for building web and mobile applications.

## Basic Server

```javascript
import express from 'express';

const app = express();
app.use(express.json()); // Parse JSON bodies

// Route handler
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

## Middleware

Middleware functions have access to `req`, `res`, and `next`. They execute in order.

```javascript
// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Pass to next middleware
});

// Error middleware (4 params)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
```

:::revision
- Express is a minimal, unopinionated Node.js framework.
- Middleware runs in sequence via `next()`.
- Use `Router` to organize routes by feature.
- Express does not handle errors by default — add a 4-param error middleware.
:::
