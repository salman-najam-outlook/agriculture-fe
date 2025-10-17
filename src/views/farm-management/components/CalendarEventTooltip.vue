<template>
  <div 
    class="follower" 
    :style="{ top: y + 'px', left: x + 'px' }"
  >
    <slot></slot> <!-- The content you want to display that follows the mouse -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      x: 0,
      y: 0,
      tooltipWidth: 600, // Estimate or dynamically calculate this value if needed
      tooltipHeight: 200  // Estimate or dynamically calculate this value if needed
    };
  },
  mounted() {
    window.addEventListener('click', this.updatePosition);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.updatePosition);
  },
  methods: {
    updatePosition(event) {
      const offsetX = 10; // Horizontal offset from the cursor
      const offsetY = 10; // Vertical offset from the cursor

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let x = event.clientX + offsetX;
      let y = event.clientY + offsetY;

      // Check if tooltip exceeds the right or bottom window border and adjust
      if (x + this.tooltipWidth > windowWidth) {
        x = windowWidth - this.tooltipWidth - offsetX;
      }

      if (y + this.tooltipHeight > windowHeight) {
        y = windowHeight - this.tooltipHeight - offsetY;
      }

      this.x = x;
      this.y = y;
    }
  }
};
</script>

<style scoped>
.follower {
  position: absolute;
  pointer-events: none; /* Prevent interaction with the mouse */
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 20px 20px 20px 20px;
  border-radius: 5px;
  white-space: nowrap;
  z-index: 9999;
  transform: translate(-50%, -50%);
  max-width: 1000px;
  min-width: 600px;
}
</style>
