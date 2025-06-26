<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue"
const tips = [
  "正在努力生成报告",
  "悄悄滴爬虫，打枪滴不要",
  "还在一点点地获取信息",
  "先让我偷偷瞄一眼",
]

const tipIndex = ref(Math.floor(Math.random() * tips.length))
const tip = computed(() => tips[tipIndex.value])

let interval: number
onMounted(() => {
  interval = setInterval(
    () => {
      let nextIndex = Math.floor(Math.random() * tips.length)
      while (nextIndex === tipIndex.value) {
        nextIndex = Math.floor(Math.random() * tips.length)
      }
      tipIndex.value = nextIndex
    },
    3000,
    null,
  )
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <div class="w-full m-t-12">
    <div class="m-x-auto flex flex-col items-center">
      <div
        class="via-transparent via-25% rounded-full bg-gradient-conic from-transparent to-black dark:to-white w-12 h-12 relative animate-spin">
        <div class="bg-white dark:bg-[#121212] rounded-full w-10 h-10 left-1 top-1 absolute"></div>
      </div>
      <h3 class="m-b-2">报告生成中</h3>
      <div
        class="flex flex-col items-center gap-1 text-center text-gray-500 dark:text-truegray-400">
        <Transition mode="out-in">
          <span :key="tip" whitespace-pre text-wrap>{{ tip }}</span>
        </Transition>
        <span>请坐和放宽</span>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
/* layer: preflights */
*,
::before,
::after {
  --un-rotate: 0;
  --un-rotate-x: 0;
  --un-rotate-y: 0;
  --un-rotate-z: 0;
  --un-scale-x: 1;
  --un-scale-y: 1;
  --un-scale-z: 1;
  --un-skew-x: 0;
  --un-skew-y: 0;
  --un-translate-x: 0;
  --un-translate-y: 0;
  --un-translate-z: 0;
  --un-pan-x: ;
  --un-pan-y: ;
  --un-pinch-zoom: ;
  --un-scroll-snap-strictness: proximity;
  --un-ordinal: ;
  --un-slashed-zero: ;
  --un-numeric-figure: ;
  --un-numeric-spacing: ;
  --un-numeric-fraction: ;
  --un-border-spacing-x: 0;
  --un-border-spacing-y: 0;
  --un-ring-offset-shadow: 0 0 rgb(0 0 0 / 0);
  --un-ring-shadow: 0 0 rgb(0 0 0 / 0);
  --un-shadow-inset: ;
  --un-shadow: 0 0 rgb(0 0 0 / 0);
  --un-ring-inset: ;
  --un-ring-offset-width: 0px;
  --un-ring-offset-color: #fff;
  --un-ring-width: 0px;
  --un-ring-color: rgb(147 197 253 / 0.5);
  --un-blur: ;
  --un-brightness: ;
  --un-contrast: ;
  --un-drop-shadow: ;
  --un-grayscale: ;
  --un-hue-rotate: ;
  --un-invert: ;
  --un-saturate: ;
  --un-sepia: ;
  --un-backdrop-blur: ;
  --un-backdrop-brightness: ;
  --un-backdrop-contrast: ;
  --un-backdrop-grayscale: ;
  --un-backdrop-hue-rotate: ;
  --un-backdrop-invert: ;
  --un-backdrop-opacity: ;
  --un-backdrop-saturate: ;
  --un-backdrop-sepia: ;
}
::backdrop {
  --un-rotate: 0;
  --un-rotate-x: 0;
  --un-rotate-y: 0;
  --un-rotate-z: 0;
  --un-scale-x: 1;
  --un-scale-y: 1;
  --un-scale-z: 1;
  --un-skew-x: 0;
  --un-skew-y: 0;
  --un-translate-x: 0;
  --un-translate-y: 0;
  --un-translate-z: 0;
  --un-pan-x: ;
  --un-pan-y: ;
  --un-pinch-zoom: ;
  --un-scroll-snap-strictness: proximity;
  --un-ordinal: ;
  --un-slashed-zero: ;
  --un-numeric-figure: ;
  --un-numeric-spacing: ;
  --un-numeric-fraction: ;
  --un-border-spacing-x: 0;
  --un-border-spacing-y: 0;
  --un-ring-offset-shadow: 0 0 rgb(0 0 0 / 0);
  --un-ring-shadow: 0 0 rgb(0 0 0 / 0);
  --un-shadow-inset: ;
  --un-shadow: 0 0 rgb(0 0 0 / 0);
  --un-ring-inset: ;
  --un-ring-offset-width: 0px;
  --un-ring-offset-color: #fff;
  --un-ring-width: 0px;
  --un-ring-color: rgb(147 197 253 / 0.5);
  --un-blur: ;
  --un-brightness: ;
  --un-contrast: ;
  --un-drop-shadow: ;
  --un-grayscale: ;
  --un-hue-rotate: ;
  --un-invert: ;
  --un-saturate: ;
  --un-sepia: ;
  --un-backdrop-blur: ;
  --un-backdrop-brightness: ;
  --un-backdrop-contrast: ;
  --un-backdrop-grayscale: ;
  --un-backdrop-hue-rotate: ;
  --un-backdrop-invert: ;
  --un-backdrop-opacity: ;
  --un-backdrop-saturate: ;
  --un-backdrop-sepia: ;
}
/* layer: default */
.relative {
  position: relative;
}
.left-1 {
  left: 0.25rem;
}
.top-1 {
  top: 0.25rem;
}
.m-x-auto {
  margin-left: auto;
  margin-right: auto;
}
.h-10 {
  height: 2.5rem;
}
.h-12 {
  height: 3rem;
}
.w-10 {
  width: 2.5rem;
}
.w-12 {
  width: 3rem;
}
.w-full {
  width: 100%;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
.items-center {
  align-items: center;
}
.gap-1 {
  gap: 0.25rem;
}
.whitespace-pre {
  white-space: pre;
}
.rounded-full {
  border-radius: 9999px;
}
.bg-white {
  --un-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--un-bg-opacity)) /* #fff */;
}
.dark .dark\:bg-\[\#121212\] {
  --un-bg-opacity: 1;
  background-color: rgb(18 18 18 / var(--un-bg-opacity)) /* #121212 */;
}
.from-transparent {
  --un-gradient-from-position: 0%;
  --un-gradient-from: transparent var(--un-gradient-from-position);
  --un-gradient-to-position: 100%;
  --un-gradient-to: rgb(255 255 255 / 0) var(--un-gradient-to-position);
  --un-gradient-stops: var(--un-gradient-from), var(--un-gradient-to);
}
.via-transparent {
  --un-gradient-via-position: 50%;
  --un-gradient-to: rgb(255 255 255 / 0);
  --un-gradient-stops: var(--un-gradient-from), transparent var(--un-gradient-via-position),
    var(--un-gradient-to);
}
.dark .dark\:to-white {
  --un-gradient-to-position: 100%;
  --un-gradient-to: rgb(255 255 255 / var(--un-to-opacity, 1)) var(--un-gradient-to-position);
}
.to-black {
  --un-gradient-to-position: 100%;
  --un-gradient-to: rgb(0 0 0 / var(--un-to-opacity, 1)) var(--un-gradient-to-position);
}
.via-25\% {
  --un-gradient-via-position: 25%;
}
.bg-gradient-conic {
  background-image: conic-gradient(
    var(--un-gradient, var(--un-gradient-stops, rgb(255 255 255 / 0)))
  );
}
.text-center {
  text-align: center;
}
.text-gray-500 {
  --un-text-opacity: 1;
  color: rgb(107 114 128 / var(--un-text-opacity)) /* #6b7280 */;
}
.transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke,
    opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.ease {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.absolute {
  position: absolute;
}
</style>
