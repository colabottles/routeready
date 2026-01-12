# RouteReady

## Fleet Management System

In Progress

---

## Server routing endpoint (OpenRouteService)

A small server endpoint is available to request driving directions from OpenRouteService.

- Endpoint: `POST /api/directions` (folder endpoint: `server/api/directions/index.post.ts`)
- Body (JSON):
  - `coordinates`: array of `[lon, lat]` coordinate pairs (at least two) OR provide `origin` and `destination` pairs
  - `profile` (optional): routing profile, default `driving-car`

Example curl:

```bash
curl -X POST http://localhost:3000/api/directions \
  -H "Content-Type: application/json" \
  -d '{"coordinates":[[-122.4194,37.7749],[-122.2711,37.8715]]}'
```

Make sure to set the environment variable `ORS_API_KEY` with your OpenRouteService API key (server-only).
