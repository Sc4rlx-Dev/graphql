# GraphQL Service

Minimal GraphQL API.
- Host page: https://scarlx-graphql.netlify.app/

## Usage and Concepts

This project provides a minimal GraphQL API. You can interact with it by sending GraphQL queries to the host page.

### What is GraphQL?

GraphQL is a query language for your API, and a server-side runtime for executing queries by using a type system you define for your data. It's designed to make APIs fast, flexible, and developer-friendly.

Instead of making multiple REST calls to fetch data, with GraphQL, you send a single query to retrieve exactly what you need.

### How to use this API

You can use any GraphQL client (like GraphiQL, Postman, or a simple `fetch` request in JavaScript) to send queries to the host page.

Here's an example query to check the health of the service:

```graphql
query {
    health
}
```

This query asks for the `health` field, which typically returns a simple status like "ok" if the service is running correctly.

Resources:
- [GraphQL — spec.graphql.org](https://spec.graphql.org/)
- [GraphQL Specification Versions — spec.graphql.org](https://spec.graphql.org/versions/)
- [Introduction to GraphQL | GraphQL — graphql.org](https://graphql.org/learn/)
- [GraphQL | A query language for your API — graphql.org](https://graphql.org/)
- [SVG: Scalable Vector Graphics | MDN — developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/SVG)
