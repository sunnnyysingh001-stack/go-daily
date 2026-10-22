# Java API

| Method | Path          | Response                                                                                      |
| ------ | ------------- | --------------------------------------------------------------------------------------------- |
| GET    | `/api/health` | `{"status":"ok","service":"go-daily-api"}`                                                    |
| GET    | `/api/news`   | `items`, `checked`, `status`, `message`, `curation`, `latestPublished`, `lastSuccessfulCheck` |

News responses use `Cache-Control: no-store`. `status` is `manual`; curation is explicitly `partial`. These fields do not imply a live feed. There are no write endpoints. Unknown routes return 404 and unsupported methods return 405.

The Next.js proxy imposes an eight-second timeout and returns 503 for upstream failure. `JAVA_API_URL` must be a trusted deployment origin set by the operator; it is never read from request parameters.
