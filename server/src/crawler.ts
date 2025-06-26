import * as cheerio from "cheerio"
import type { CommonResponse, Submission } from "./model"
import { createClient } from "./client"

export const crawl = async (email: string, password: string, year: number) => {
  let page = 1
  const client = createClient()
  const login_response = await client.post<CommonResponse<string>>(
    "/api/auth/login",
    {
      email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  )
  if (login_response.data.result !== "SUCCESS") {
    throw new Error(login_response.data.message || "登录失败")
  }
  const index_response = await client.get("/")
  const $ = cheerio.load(index_response.data)
  let user_homepage = $("#userMenu > li:nth-child(2) > a").first().attr("href")
  if (!user_homepage) {
    throw new Error("无法找到用户主页链接")
  }
  const submissions = [] as Submission[]
  while (true) {
    const submission_page_response = await client.get(`${user_homepage}?page=${page}`)
    const $ = cheerio.load(submission_page_response.data)
    const submission_rows = $(".recently-submit tbody tr")
    let flag = false
    for (const row of submission_rows) {
      const submission_time = new Date($(row).find(".date abbr").attr("title")!.trim() + "+08:00")
      if (submission_time.getFullYear() < year) {
        flag = true
        break
      }
      if (submission_time.getFullYear() > year) {
        continue
      }
      const raw_problem_name = $(row).find(".title").text().trim()
      const problem_name_match = /.*?: (.*)/.exec(raw_problem_name)
      let problem_name = raw_problem_name
      if (problem_name_match) {
        problem_name = problem_name_match[1].trim()
      }
      const submission: Submission = {
        contest_name: $(row).find(".contest").text().trim(),
        problem_name,
        result: $(row).find(".result").text().trim(),
        execution_memory: Number($(row).find(".memory").text().trim().slice(0, -2).trim()),
        execution_time: Number($(row).find(".spening-time").text().trim().slice(0, -2).trim()),
        code_length: Number($(row).find(".code-length").text().trim().slice(0, -2).trim()),
        language: $(row).find(".language").text().trim(),
        submission_time: new Date($(row).find(".date abbr").attr("title")!.trim()),
      }
      submissions.push(submission)
    }
    if (flag) break
    if (!$(".page-bar .pages a[rel='next']").first().attr("href")) {
      break
    }
    page++
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  const first_home_page = await client.get(user_homepage)
  const username = $(first_home_page.data)
    .find(".user-info .owner-info dd:first-of-type")
    .first()
    .text()
    .trim()
  return { submissions, username }
}
