---
title: Sessions
category: Backend
topic: Sessions
difficulty: Beginner
description: HTTP sessions maintain stateful user context across stateless HTTP requests using server-side storage.
tags:
  - backend
  - sessions
  - authentication
  - cookies
order: 6
---

## What are Sessions?

HTTP is **stateless** — each request is independent. Sessions allow the server to maintain state about a user across multiple requests.

## How Sessions Work

```mermaid
sequenceDiagram
    participant U as Browser
    participant S as Server
    participant DB as Session Store

    U->>S: POST /login { email, password }
    S->>DB: Store session { userId: 42 }
    DB-->>S: sessionId = "abc123"
    S-->>U: Set-Cookie: sessionId=abc123; HttpOnly

    U->>S: GET /dashboard (Cookie: sessionId=abc123)
    S->>DB: Lookup session "abc123"
    DB-->>S: { userId: 42 }
    S-->>U: 200 Dashboard HTML
```

## Session vs JWT

| Feature | Session | JWT |
|---------|---------|-----|
| Storage | Server | Client |
| Revocation | Instant | Requires blacklist |
| Scalability | Needs shared store | Stateless |
| Size | Small cookie | Larger token |

:::revision
- Sessions store state server-side; only a session ID is sent to the client via cookie.
- Use `HttpOnly; Secure; SameSite=Strict` cookie flags.
- Popular session stores: Redis, MongoDB, in-memory (dev only).
- Sessions are easy to revoke — just delete the server-side record.
:::
