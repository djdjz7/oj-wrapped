import { crawl } from "./crawler"
import { DefaultMap } from "./utils"

type AnalyzeTarget = Awaited<ReturnType<typeof crawl>>

export const analyze = (target: AnalyzeTarget) => {
  const {
    probset_submission_count,
    problem_submission_count,
    lang_submission_count,
    result_count,
    ac_count,
  } = target.submissions.reduce(
    (acc, submission) => {
      acc.probset_submission_count[submission.contest_name]++
      acc.problem_submission_count[submission.problem_name]++
      acc.lang_submission_count[submission.language]++
      acc.result_count[submission.result]++
      acc.ac_count[submission.problem_name] += submission.result === "Accepted" ? 1 : 0
      return acc
    },
    {
      probset_submission_count: new DefaultMap((_) => 0),
      problem_submission_count: new DefaultMap((_) => 0),
      lang_submission_count: new DefaultMap((_) => 0),
      result_count: new DefaultMap((_) => 0),
      ac_count: new DefaultMap((_) => 0),
    },
  )
  const most_submitted_problem = Object.entries(problem_submission_count).sort((a, b) => {
    return b[1] - a[1]
  })[0]
  const most_accepted_problem = Object.entries(ac_count).sort((a, b) => {
    return b[1] - a[1]
  })[0]
  const late_night_submission = target.submissions.sort((a, b) => {
    const a_time = new Date(a.submission_time)
    const b_time = new Date(b.submission_time)
    const a_time_justified =
      ((a_time.getUTCHours() + 8 - 6 + 24) % 24) * 3600 +
      a_time.getUTCMinutes() * 60 +
      a_time.getUTCSeconds()
    const b_time_justified =
      ((b_time.getUTCHours() + 8 - 6 + 24) % 24) * 3600 +
      b_time.getUTCMinutes() * 60 +
      b_time.getUTCSeconds()
    return b_time_justified - a_time_justified
  })[0]

  return {
    username: target.username,
    probset_submission_count,
    most_submitted_problem: most_submitted_problem
      ? {
          name: most_submitted_problem[0],
          count: most_submitted_problem[1],
          pobsets: Array.from(
            new Set(
              target.submissions
                .filter((x) => x.problem_name === most_accepted_problem[0])
                .map((x) => x.contest_name),
            ),
          ),
          accepted: ac_count[most_submitted_problem[0]] > 0,
        }
      : undefined,
    most_accepted_problem: most_accepted_problem
      ? {
          name: most_accepted_problem[0],
          count: most_accepted_problem[1],
          pobsets: Array.from(
            new Set(
              target.submissions
                .filter((x) => x.problem_name === most_accepted_problem[0])
                .map((x) => x.contest_name),
            ),
          ),
        }
      : undefined,
    late_night_submission: late_night_submission
      ? {
          problem_name: late_night_submission.problem_name,
          contest_name: late_night_submission.contest_name,
          submission_time: late_night_submission.submission_time,
          result: late_night_submission.result,
          probset: late_night_submission.contest_name,
        }
      : undefined,
    result_count,
    lang_submission_count,
    total_submission_count: target.submissions.length,
    total_problem_count: Object.keys(problem_submission_count).length,
    total_problem_ac_count: Object.entries(ac_count).filter((x) => x[1] > 0).length,
  }
}
