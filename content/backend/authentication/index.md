---
title: Authentication
category: Backend
topic: Authentication
difficulty: Intermediate
description: Authentication verifies the identity of a user or system. Learn the core patterns used in web applications.
tags:
  - backend
  - authentication
  - security
  - jwt
  - sessions
order: 4
---

## Authentication vs Authorization

:::info Key Distinction
- **Authentication** — *Who are you?* (verifying identity)
- **Authorization** — *What can you do?* (verifying permissions)
:::

## Common Authentication Methods

| Method | Description | Use Case |
|--------|-------------|----------|
| **Password** | Username + password | Most web apps |
| **JWT** | Signed tokens | SPAs, APIs |
| **Session** | Server-side session | Traditional web apps |
| **OAuth 2.0** | Delegate auth to third party | "Login with Google" |
| **API Key** | Static token | Service-to-service |
| **MFA** | Multiple factors | High-security apps |

## Password Hashing

```typescript
import bcrypt from 'bcrypt';

// Hash password (never store plaintext)
const hashed = await bcrypt.hash(password, 12); // 12 = salt rounds

// Verify
const isValid = await bcrypt.compare(inputPassword, hashed);
```

:::warning Never store plain-text passwords
Always use a slow, adaptive hashing algorithm like **bcrypt**, **argon2**, or **scrypt**. MD5 and SHA1 are NOT suitable for passwords.
:::

:::revision
- Authentication = proving identity. Authorization = proving permission.
- Always hash passwords with bcrypt/argon2 — never store plaintext.
- Use HTTPS — never send credentials over HTTP.
- Sessions store state server-side; JWTs are stateless.
- OAuth 2.0 is a framework for delegated authorization.
:::
