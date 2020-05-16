<template>
  <svg
    class="progress-ring"
    :width="this.size"
    :height="this.size">
    <circle
      class="progress-ring__circle"
      :class="circleClassName"
      :style="circleStyle"
      fill="transparent"
      :r="radius"
      :cy="csize"
      :cx="csize"
      :stroke-width="strokeWidth"/>
  </svg>
</template>

<script lang="ts" src="./ring.ts"></script>

<style lang="scss" src="./ring.scss" scoped></style>
