<template>
  <div id="login" class="screen" v-if="status === 'login'">
    <h1>👀看看✌️今年在 OpenJudge 上干了啥👀</h1>
    <span class="subtle">{{ new Date().getFullYear() }} ver. 🎉</span>
    <input
      type="text"
      v-model="email"
      placeholder="OpenJudge 登录邮箱"
      @keypress.enter="getReport" />
    <input
      type="password"
      v-model="password"
      placeholder="OpenJudge 登录密码"
      @keypress.enter="getReport" />
    <button @click="getReport">登录</button>
    <p class="subtle eula">
      邮箱与密码仅用于登录 OpenJudge 平台，<br />
      我们不会以任何形式存储或使用您的登录信息。<br />
      如果您有任何疑问，也可在
      <a href="https://github.com/djdjz7/oj-wrapped/">GitHub 仓库</a>审查本项目代码。
    </p>
  </div>
  <div id="fetching" class="screen" v-else-if="status === 'loading'">
    <LoadingComponent v-if="!error" />
    <div v-else>
      <h2>获取报告失败</h2>
      <p class="subtle">{{ error }}</p>
      <p>请检查 OpenJudge 登录邮箱与密码</p>
      <p>
        若您确定这是系统问题，请
        <a href="https://github.com/djdjz7/oj-wrapped/issues/new">创建 issue</a>
      </p>
      <button @click="status = 'login'">返回登录</button>
    </div>
  </div>
  <div id="report" v-else v-if="report">
    <div class="screen">
      <h1>{{ report.username }} 的年度 OpenJudge 报告🥳</h1>
      <span class="subtle">{{ new Date().getFullYear() }} ver. 🎉</span>
      <p>
        今年，你一共提交了<span class="emphasis">{{ report.total_submission_count }} 次</span><br />
        其中<span class="emphasis accepted">{{ report.result_count["Accepted"] }} 次</span
        >通过了评测<br />
        这是你提交结果的统计：
      </p>
      <div>
        <div v-for="result in result_stats">
          <span
            :style="{
              left: `${(result[1] / report.total_submission_count) * 100}%`,
              color: result_class_map[result[0]],
              fontWeight: 'bold',
              fontSize: '.75em',
            }"
            >{{ result[0] }}</span
          >
          <div
            :style="{
              height: '2em',
              width: `${(result[1] / report.total_submission_count) * 100}%`,
              backgroundColor: result_class_map[result[0]],
              position: 'relative',
            }">
            <span
              style="
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                color: white;
                font-weight: bold;
                right: 0.2em;
              "
              >{{ result[1] }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="screen">
      <h1>提交统计</h1>
      <p>
        你尝试了<span class="emphasis">{{ report.total_problem_count }} 题</span><br />
        其中解决了<span class="emphasis accepted">{{ report.total_problem_ac_count }} 题</span
        ><br />
        这些问题分布在<span class="emphasis">{{ probset_stats.length }} 个</span>题集中<br />
        这是你的题集提交次数统计：
      </p>
      <div>
        <div v-for="probset in probset_stats">
          <span
            :style="{
              left: `${(probset[1] / report.total_submission_count) * 100}%`,
              color: stringToColor(probset[0]),
              fontWeight: 'bold',
              fontSize: '.75em',
            }"
            >{{ probset[0] }}</span
          >
          <div
            :style="{
              height: '2em',
              width: `${(probset[1] / report.total_submission_count) * 100}%`,
              backgroundColor: stringToColor(probset[0]),
              position: 'relative',
            }">
            <span
              style="
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                color: white;
                font-weight: bold;
                right: 0.2em;
              "
              >{{ probset[1] }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="screen">
      <h1 v-if="lang_submission_stats.length <= 2">语言运用</h1>
      <h1 v-else>多语言人才</h1>
      <p>
        <span v-if="lang_submission_stats.length == 1">
          你只使用了<span class="emphasis">{{ lang_submission_stats[0][0] }}</span
          >进行提交<br />
          现实中的你，一定很专一🌹
        </span>
        <span v-else>
          你使用了<span class="emphasis">{{ lang_submission_stats.length }} 种</span
          >语言进行提交<br />
          是 Python 不够快？还是 C++ 太难写？<br />
          这是你的语言提交次数统计：
        </span>
      </p>
      <div>
        <div v-for="lang in lang_submission_stats">
          <span
            :style="{
              left: `${(lang[1] / report.total_submission_count) * 100}%`,
              color: stringToColor(lang[0]),
              fontWeight: 'bold',
              fontSize: '.75em',
            }"
            >{{ lang[0] }}</span
          >
          <div
            :style="{
              height: '2em',
              width: `${(lang[1] / report.total_submission_count) * 100}%`,
              backgroundColor: stringToColor(lang[0]),
              position: 'relative',
            }">
            <span
              style="
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                color: white;
                font-weight: bold;
                right: 0.2em;
              "
              >{{ lang[1] }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="screen">
      <h1>高光时刻</h1>
      <div class="adaptive-grid">
        <div class="card" v-if="report.most_submitted_problem">
          <span class="card-description">提交次数最多的题目</span>
          <h2>
            {{ report.most_submitted_problem.name }}
            <span
              :class="[
                report.most_submitted_problem.accepted ? 'accepted' : 'not-accepted',
                'capsule',
              ]">
              <span>{{ report.most_submitted_problem.accepted ? "通过" : "未通过" }}</span>
            </span>
          </h2>
          <p class="probset">{{ report.most_submitted_problem.pobsets.join(", ") }}</p>
          <p class="card-main-para">是被什么卡住了？超时？爆内存？还是意想不到的 corner case？🏳️</p>
          <p class="card-main-point">{{ report.most_submitted_problem.count }} 次提交</p>
        </div>
        <div class="card" v-if="report.most_accepted_problem">
          <span class="card-description">通过次数最多的题目</span>
          <h2>
            {{ report.most_accepted_problem.name }}
            <span class="capsule accepted">通过</span>
          </h2>
          <p class="probset">{{ report.most_accepted_problem.pobsets.join(", ") }}</p>
          <p class="card-main-para">
            反复折磨测评机让它给你吐出 Accepted 一定让你获得了莫大的快感😈
          </p>
          <p class="card-main-point">{{ report.most_accepted_problem.count }} 次通过</p>
        </div>
        <div class="card" v-if="report.late_night_submission">
          <span class="card-description">深夜（是吗？）coding</span>
          <h2>
            {{ report.late_night_submission.problem_name }}
            <span
              class="capsule"
              :style="{
                color: result_class_map[report.late_night_submission.result],
                backgroundColor: `rgb(from ${
                  result_class_map[report.late_night_submission.result]
                } r g b / 0.2)`,
              }"
              >{{ report.late_night_submission.result }}</span
            >
          </h2>
          <span class="probset">{{ report.late_night_submission.contest_name }}</span>
          <span class="probset"
            >{{ report.late_night_submission.language }},
            {{ report.late_night_submission.execution_memory }}kB,
            {{ report.late_night_submission.execution_time }}ms</span
          >
          <p class="card-main-para">你见过凌晨四点的测评机吗？我没有😴</p>
          <p class="card-main-point">
            {{ transformTime(report.late_night_submission.submission_time as unknown as string) }}
          </p>
        </div>
        <div class="card" v-if="report.smallest_submission">
          <span class="card-description">小小的也很可爱</span>
          <h2>
            {{ report.smallest_submission.problem_name }}
            <span
              class="capsule"
              :style="{
                color: stringToColor(report.smallest_submission.language),
                backgroundColor: `rgb(from ${stringToColor(
                  report.smallest_submission.language,
                )} r g b / 0.2)`,
              }"
              >{{ report.smallest_submission.language }}</span
            >
          </h2>
          <span class="probset">{{ report.smallest_submission.contest_name }}</span>
          <span class="probset"
            >{{ report.smallest_submission.language }},
            {{ report.smallest_submission.execution_memory }}kB,
            {{ report.smallest_submission.execution_time }}ms</span
          >
          <p class="card-main-para">你提交过的最小通过代码，这都能过？🫣</p>
          <p class="card-main-point">{{ report.smallest_submission.code_length }} 字节</p>
        </div>
        <div class="card" v-if="report.most_memory_usage">
          <span class="card-description">内存大户</span>
          <h2>
            {{ report.most_memory_usage.problem_name }}
            <span
              class="capsule"
              :style="{
                color: stringToColor(report.most_memory_usage.language),
                backgroundColor: `rgb(from ${stringToColor(
                  report.most_memory_usage.language,
                )} r g b / 0.2)`,
              }"
              >{{ report.most_memory_usage.language }}</span
            >
          </h2>
          <span class="probset">{{ report.most_memory_usage.contest_name }}</span>
          <span class="probset"
            >{{ report.most_memory_usage.language }},
            {{ report.most_memory_usage.execution_memory }}kB,
            {{ report.most_memory_usage.execution_time }}ms</span
          >
          <p class="card-main-para">通过的提交中内存占用最大的一发。内存？吃一口。好吃再来一口😋</p>
          <p class="card-main-point">{{ report.most_memory_usage.execution_memory }}kB</p>
        </div>
        <div class="card" v-if="report.most_time_consuming">
          <span class="card-description">时间都去哪了</span>
          <h2>
            {{ report.most_time_consuming.problem_name }}
            <span
              class="capsule"
              :style="{
                color: stringToColor(report.most_time_consuming.language),
                backgroundColor: `rgb(from ${stringToColor(
                  report.most_time_consuming.language,
                )} r g b / 0.2)`,
              }"
              >{{ report.most_time_consuming.language }}</span
            >
          </h2>
          <span class="probset">{{ report.most_time_consuming.contest_name }}</span>
          <span class="probset"
            >{{ report.most_time_consuming.language }},
            {{ report.most_time_consuming.execution_memory }}kB,
            {{ report.most_time_consuming.execution_time }}ms</span
          >
          <p class="card-main-para">通过的提交中时间占用最长的一发。快，管理员来卡卡常数⏰</p>
          <p class="card-main-point">{{ report.most_time_consuming.execution_time }}ms</p>
        </div>
      </div>
    </div>
    <div class="screen">
      <h1>到此为止了吗？🤓</h1>
      <p>
        这份报告到这里就告一段落了，<br />
        希望这份报告记录的每一次提交都让你收获了快乐与成长。
      </p>

      <p>
        如果你有新的点子，也可以访问<a href="https://github.com/djdjz7/oj-wrapped/">项目主页</a
        >参与讨论或贡献代码。
      </p>
      <p>最后，感谢各位老师、助教以及 OpenJudge 一年以来的付出🌹🌹🌹</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { treaty } from "@elysiajs/eden"
import { computed, ref } from "vue"
import type { App as ElysiaApp } from "../../server/src/index"
import LoadingComponent from "./components/LoadingComponent.vue"
const status = ref<"login" | "loading" | "report">("login")
const email = ref("")
const password = ref("")
const error = ref()
const server_location = new URL("/api/", window.location.href)
const server = treaty<ElysiaApp>(server_location.href, {})
const report =
  ref<
    Exclude<Awaited<ReturnType<(typeof server)["get-report"]["post"]>>["data"], { errors: any }>
  >()
const result_stats = computed(() => {
  if (!report.value) return []
  return Object.entries(report.value.result_count).sort((a, b) => {
    return b[1] - a[1]
  })
})

const probset_stats = computed(() => {
  if (!report.value) return []
  return Object.entries(report.value.probset_submission_count).sort((a, b) => {
    return b[1] - a[1]
  })
})

const lang_submission_stats = computed(() => {
  if (!report.value) return []
  return Object.entries(report.value.lang_submission_count).sort((a, b) => {
    return b[1] - a[1]
  })
})

function transformTime(date_string: string): string {
  const date = new Date(date_string)
  const options = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Shanghai",
  })
  return options.format(date)
}

async function getReport() {
  if (!email.value || !password.value) {
    alert("请输入邮箱和密码")
    return
  }
  error.value = null
  status.value = "loading"
  const { data, error: err } = await server["get-report"].post({
    email: email.value,
    password: password.value,
    year: new Date().getFullYear(),
  })
  error.value = err
  if (err) return
  if ("errors" in data) {
    error.value = data.errors.join("; ")
    status.value = "login"
    return
  }
  status.value = "report"
  report.value = data
}

function stringToColor(input: string): string {
  const hash = input.split("").reduce((acc, curr) => {
    return acc * 31 + curr.charCodeAt(0)
  }, 0)
  const hue = hash % 360
  const saturation = 70

  return `hsl(${hue}, ${saturation}%, ${50}%)`
}

const result_class_map = {
  Accepted: "var(--accepted)",
  "Wrong Answer": "var(--wrong-answer)",
  "Time Limit Exceeded": "var(--time-limit-exceeded)",
  "Memory Limit Exceeded": "var(--memory-limit-exceeded)",
  "Runtime Error": "var(--runtime-error)",
  "Compile Error": "var(--compile-error)",
  "Presentation Error": "var(--presentation-error)",
  "Output Limit Exceeded": "var(--output-limit-exceeded)",
  "System Error": "var(--system-error)",
  Waiting: "var(--waiting)",
} as Record<string, string>
</script>

<style>
:root {
  --accepted: #1d74ff;
  --wrong-answer: #ff4d4d;
  --time-limit-exceeded: #ffb84d;
  --memory-limit-exceeded: #ffb84d;
  --runtime-error: #ff4d4d;
  --compile-error: #00b70c;
  --presentation-error: #ff4d4d;
  --output-limit-exceeded: #ff4d4d;
  --system-error: #ff4d4d;
  --waiting: #888;
}
#login {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1em;
  margin-top: -2em;
}

#login h1 {
  margin: 0;
}

#fetching {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1em;
}

.subtle {
  color: #888;
}

.screen {
  width: 100%;
  height: 100dvh;
  padding: 4em;
  box-sizing: border-box;
  overflow: auto;
}

.emphasis {
  font-weight: bold;
  font-size: 180%;
  margin-left: 0.2em;
  margin-right: 0.2em;
}

input {
  width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  width: 150px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  color: #222;
  background-color: #eee;
  cursor: pointer;
}

a {
  color: #007bff;
  text-underline-offset: 2px;
}

.eula {
  font-size: 0.8em;
}

.accepted {
  color: var(--accepted);
}

.not-accepted {
  color: var(--wrong-answer);
}

.adaptive-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
}

.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5em 2em;
  position: relative;
  display: flex;
  flex-direction: column;
}

.card p {
  margin: 0;
}

.card h2 {
  margin: 0.2em 0 0 0;
}

.card-description {
  font-size: 0.8em;
  color: #888;
}

p.card-main-para {
  margin: 0.5em 0;
  flex: 1;
}

.card-main-point {
  font-weight: bold;
  font-size: 2em;
  text-align: end;
}

.probset {
  color: #888;
}

.capsule {
  padding: 0.2em 0.5em;
  border-radius: 1em;
  font-size: 0.5em;
  margin-left: 0.5em;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}

.capsule.accepted {
  background-color: rgb(from var(--accepted) r g b / 0.2);
}

.capsule.not-accepted {
  background-color: var(--wrong-answer);
  color: white;
}

@media screen and (max-width: 600px) {
  .screen {
    padding: 2em;
  }
  .adaptive-grid {
    grid-template-columns: 1fr;
  }
}
</style>
