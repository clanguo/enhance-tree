<template>
  <span class="loading">
    <i class="loading_dot"></i>
    <i class="loading_dot"></i>
    <i class="loading_dot"></i>
    <i class="loading_dot"></i>
  </span>
</template>

<script>
export default {}
</script>

<style scoped>
@keyframes loading {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dotMove {
  100% {
    opacity: 1;
  }
}

.loading {
  position: relative;
  display: inline-block;
  font-size: 20px;
  width: 1em;
  height: 1em;
  color: #1890ff;
  animation: loading 1.2s infinite linear;
  transform: rotate(0);
}

.loading_dot {
  position: absolute;
  display: block;
  width: 9px;
  height: 9px;
  background-color: #1890ff;
  border-radius: 100%;
  transform: scale(0.75);
  transform-origin: 50% 50%;
  opacity: 0.3;
  animation: dotMove 1s infinite linear alternate;
}

.loading_dot:nth-child(1) {
  top: 0;
  left: 0;
}

.loading_dot:nth-child(2) {
  top: 0;
  right: 0;
  animation-delay: 0.4s;
}

.loading_dot:nth-child(3) {
  right: 0;
  bottom: 0;
  animation-delay: 0.8s;
}

.loading_dot:nth-child(4) {
  bottom: 0;
  left: 0;
  animation-delay: 1.2s;
}
</style>
