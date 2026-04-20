Run before migrate
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

rapid iterations without the need to manage migration files
```
npx drizzle-kit push
```

Generate migrations:
```
npx drizzle-kit generate
```

Apply migrations:
```
npx drizzle-kit migrate
```