# GraphQL Service

Minimal GraphQL API.

- Requirements: Node.js 18+, npm or yarn
- Install: npm install
- Dev: npm run dev (default http://localhost:4000/graphql)
- Build: npm run build
- Start: npm run start
- Host page: https://graphql-scarlx.netlify.app/
- Test: npm test

Example query:
```graphql
query {
    health
}
```

cURL:
```bash
curl -X POST http://localhost:4000/graphql \
    -H "Content-Type: application/json" \
    -d '{"query":"{ health }"}'
```

Notes:
- Configure env via .env (copy .env.example if present)
- Adjust port and CORS in server config
- Open GraphiQL/Playground at /graphql if enabled

Resources:
- [GraphQL — spec.graphql.org](https://spec.graphql.org/)
- [GraphQL Specification Versions — spec.graphql.org](https://spec.graphql.org/versions/)
- [Introduction to GraphQL | GraphQL — graphql.org](https://graphql.org/learn/)
- [GraphQL | A query language for your API — graphql.org](https://graphql.org/)
- [SVG: Scalable Vector Graphics | MDN — developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/SVG)
