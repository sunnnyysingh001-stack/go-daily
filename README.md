# GO DAILY

A UPSC study platform with a Next.js/React interface and a Java 17 / Spring Boot content API.

**Existing live site:** https://go-daily-upsc.vercel.app

## Features

- Prelims curriculum and practice drills, Constitution explorer, and Mains study desks.
- Bookmarks, progress, answer drafts, and validated import/export.
- Curated current-affairs archive with publisher attribution and explicit freshness status.
- Optional Supabase Google/email sign-in and private manual cloud backups.
- Java REST news API, JUnit integration tests, Docker build, and GitHub Actions CI.

## Source map

| Path                  | Responsibility                                        |
| --------------------- | ----------------------------------------------------- |
| `app/`, `components/` | Next.js pages and React UI                            |
| `lib/`                | Study storage, backup validation, publisher filtering |
| `data/`               | Shared curriculum and editorial news content          |
| `backend/`            | Java/Spring Boot read-only content API and tests      |
| `supabase/`           | Existing authentication-related backup schema and RLS |
| `tests/`              | Frontend backup validation checks                     |
| `docs/`               | Architecture and API contract                         |

## Run locally

Prerequisites: Node.js 22+, Java 17, Maven 3.6.3+ (or Docker).

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Start Java in another terminal:

```sh
mvn -f backend/pom.xml spring-boot:run
# Or: docker compose up --build
```

Set server-only `JAVA_API_URL=http://localhost:8080` in `.env.local` and restart Next.js to route `/api/news` through Java. Without that variable, the existing bundled archive remains available. An explicitly configured Java service that fails returns 503 rather than silently hiding the failure.

## Verify

```sh
npm test
npm run check
npm run build
mvn -B -f backend/pom.xml verify
```

CI runs frontend and backend checks on pushes and pull requests. Dependencies, build outputs, real environment files, and user backup data are excluded from Git.

## Deployment and scope

The linked live site is the existing Next.js deployment; this repository upload does not deploy or switch it to Java automatically. Deploy the Java container on a JVM/container host, set its HTTPS origin as `JAVA_API_URL` in Vercel, and redeploy the frontend. Keep `data/` in the build context; Maven bundles the shared archive into the JAR.

Java owns the public content API. Supabase still owns authentication and private cloud backups; this is not a complete Java migration of those services. Follow [SETUP.md](SETUP.md) for provider configuration and account-isolation checks. No service-role keys are required in the browser.

News is manually curated, not a live news feed or an AI service. Practice material is original study material, not official UPSC questions unless explicitly linked as such. Existing ABHISHEK SINGH site attribution is preserved.
