import { crawl } from "./crawler"
import { DefaultMap, Linq } from "./utils"

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
  const most_submitted_problem = Linq.max(Object.entries(problem_submission_count), (x) => x[1])
  const most_accepted_problem = Linq.max(Object.entries(ac_count), (x) => x[1])
  const late_night_submission = Linq.max(target.submissions, (x) => {
    const submission_time = new Date(x.submission_time)
    return (
      ((submission_time.getUTCHours() + 8 - 6 + 24) % 24) * 3600 +
      submission_time.getUTCMinutes() * 60 +
      submission_time.getUTCSeconds()
    )
  })

  const smallest_submission = Linq.min(
    target.submissions.filter((x) => x.result === "Accepted"),
    (x) => x.code_length,
  )
  const most_memory_usage = Linq.max(
    target.submissions.filter((x) => x.result === "Accepted"),
    (x) => x.execution_memory,
  )
  const most_time_consuming = Linq.max(
    target.submissions.filter((x) => x.result === "Accepted"),
    (x) => x.execution_time,
  )

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
                .filter((x) => x.problem_name === most_submitted_problem[0])
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
    late_night_submission: late_night_submission,
    most_time_consuming,
    most_memory_usage,
    smallest_submission,
    result_count,
    lang_submission_count,
    total_submission_count: target.submissions.length,
    total_problem_count: Object.keys(problem_submission_count).length,
    total_problem_ac_count: Object.entries(ac_count).filter((x) => x[1] > 0).length,
  }
}
