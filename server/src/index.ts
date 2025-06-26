import { Elysia, t } from "elysia"
import { analyze } from "./analyzer"
import { crawl } from "./crawler"

const app = new Elysia()
  .onError(({ code, error }) => {
    if (code === "VALIDATION") {
      return {
        message: "Invalid request data",
        errors: error.all,
      }
    }
  })
  .get("/", "HELLO")
  .post(
    "/get-report",
    async ({ body: { email, password, year } }) => {
      const data = await crawl(email, password, year)
      return analyze(data)
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        year: t.Number({ default: 2025 }),
      }),
    },
  )
  .listen(2025)

console.log(`🦊 Elysia is running at ${app.server?.url}`)

export type App = typeof app
