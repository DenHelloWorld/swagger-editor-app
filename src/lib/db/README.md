# Firestore — Collections, Indexes & Security Rules

## Architecture overview

| Data                        | Access layer                    | Used by                              |
| --------------------------- | ------------------------------- | ------------------------------------ |
| User profile                | Client SDK or Admin SDK         | Sign up flow (optional)              |
| Saved OpenAPI schema        | **Client SDK** + Security Rules | Swagger Editor (authenticated users) |
| Request history / analytics | **Admin SDK** (server)          | `/api/proxy`, History page (SSR)     |

Server-side writes for request records bypass Security Rules (Service Account).  
Rules protect **client-side** access to user-owned data (especially schemas).

---

## Collection structure

```
users/{userId}
├── email: string
├── createdAt: Timestamp | string (ISO)
│
├── requestRecords/{recordId}          ← subcollection
│   ├── userId: string                 ← denormalized for queries/indexes
│   ├── method: string
│   ├── url: string
│   ├── endpoint: string
│   ├── statusCode: number
│   ├── durationMs: number
│   ├── requestSize: number
│   ├── responseSize: number
│   ├── errorDetails?: string
│   └── timestamp: string (ISO)        ← sort key (most recent first)
│
└── schemas/current                    ← single document per user
    ├── content: string                ← raw OpenAPI JSON or YAML
    └── updatedAt: string (ISO)
```

### Path reference

| Document path                              | Description                      |
| ------------------------------------------ | -------------------------------- |
| `users/{userId}`                           | User profile                     |
| `users/{userId}/requestRecords/{recordId}` | One Try-It-Out execution record  |
| `users/{userId}/schemas/current`           | Latest saved schema for the user |

### TypeScript types

Defined in `src/types/dbTypes.ts`:

- `RequestRecordInput` — payload from proxy (no `id`, no `userId`)
- `RequestRecord` — stored record (`id`, `userId`, + input fields)
- `SavedSchema` — `{ userId, content, updatedAt }`

### Code entry points

| File                 | Responsibility                                                |
| -------------------- | ------------------------------------------------------------- |
| `request-records.ts` | `saveRequestRecord`, `getRequestRecords` (server / Admin SDK) |
| `userSchema.ts`      | `saveUserSchema`, `getUserSchema` (client SDK)                |
| `firebase/client.ts` | Client Firestore init                                         |
| `firebase/admin.ts`  | Admin SDK init (server)                                       |

`userId` on the server must come from `getUserIdFromSession()` (`src/lib/auth/getUserIdFromSession.ts`).

### Notes

- **Schemas**: authenticated client can read/write only under their own `users/{uid}/...`.
- **Request records**: written by `/api/proxy` through Admin SDK; client access is blocked.
- Adjust `requestRecords` rules if you later add client-side reads (not required for current SSR History).

## Data flow

```
Try-It-Out (authenticated)
  → POST /api/proxy
  → getUserIdFromSession()
  → saveRequestRecord(userId, record)
  → users/{userId}/requestRecords/{recordId}

Save schema (authenticated, client)
  → saveUserSchema({ userId, content, updatedAt })
  → users/{userId}/schemas/current

History page (SSR)
  → getUserIdFromSession()
  → getRequestRecords(userId)
  → render list (timestamp desc)
```
