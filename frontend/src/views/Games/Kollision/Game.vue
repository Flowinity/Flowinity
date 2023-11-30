<template>
  <div id="kollision" class="kollision">
    <KollisionPlayer :x="playerX" :y="playerY" />
    <KollisionBall
      v-for="(ball, index) in balls"
      :key="index"
      :x="ball.x"
      :y="ball.y"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KollisionPlayer from "@/components/Games/Kollision/Player.vue";
import KollisionBall from "@/components/Games/Kollision/Ball.vue";

export default defineComponent({
  name: "Game",
  components: {
    KollisionPlayer,
    KollisionBall
  },
  data() {
    return {
      balls: [] as { x: number; y: number; speedX: number; speedY: number }[],
      playerX: 0,
      playerY: 0,
      gameLoopInterval: null as unknown as NodeJS.Timeout
    };
  },
  mounted() {
    this.spawnBalls();
    this.startGameLoop();
    const element = document.getElementById("kollision");
    element.addEventListener("click", async () => {
      await element.requestPointerLock();
    });
    document.addEventListener("mousemove", this.movePlayer);
  },
  beforeUnmount() {
    this.stopGameLoop();
    document.removeEventListener("mousemove", this.movePlayer);
  },
  methods: {
    updateBallPositions() {
      this.balls.forEach((ball, index) => {
        ball.x += ball.speedX;
        ball.y += ball.speedY;

        if (ball.x <= 0 || ball.x >= this.$el.clientWidth) {
          ball.speedX = -ball.speedX;
        }

        if (ball.y <= 0 || ball.y >= this.$el.clientHeight) {
          ball.speedY = -ball.speedY;
        }
        for (let i = index + 1; i < this.balls.length; i++) {
          const otherBall = this.balls[i];
          const dx = ball.x - otherBall.x;
          const dy = ball.y - otherBall.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          console.log(distance);
          if (distance <= 20) {
            // Assuming ball radius is 10
            // Calculate collision response
            const angle = Math.atan2(dy, dx);
            const speed1 = Math.sqrt(
              ball.speedX * ball.speedX + ball.speedY * ball.speedY
            );
            const speed2 = Math.sqrt(
              otherBall.speedX * otherBall.speedX +
                otherBall.speedY * otherBall.speedY
            );
            const direction1 = Math.atan2(ball.speedY, ball.speedX);
            const direction2 = Math.atan2(otherBall.speedY, otherBall.speedX);

            const newSpeedX1 = speed1 * Math.cos(direction1 - angle);
            const newSpeedY1 = speed1 * Math.sin(direction1 - angle);
            const newSpeedX2 = speed2 * Math.cos(direction2 - angle);
            const newSpeedY2 = speed2 * Math.sin(direction2 - angle);

            const finalSpeedX1 =
              ((ball.mass - otherBall.mass) * newSpeedX1 +
                (otherBall.mass + otherBall.mass) * newSpeedX2) /
              (ball.mass + otherBall.mass);
            const finalSpeedX2 =
              ((ball.mass + ball.mass) * newSpeedX1 +
                (otherBall.mass - ball.mass) * newSpeedX2) /
              (ball.mass + otherBall.mass);

            ball.speedX = finalSpeedX1;
            ball.speedY = newSpeedY1;
            otherBall.speedX = finalSpeedX2;
            otherBall.speedY = newSpeedY2;
          }
        }
      });
    },
    startGameLoop() {
      this.gameLoopInterval = setInterval(this.updateBallPositions, 2); // ~60 fps
    },
    stopGameLoop() {
      clearInterval(this.gameLoopInterval);
    },
    movePlayer(event) {
      this.playerX = event.clientX;
      this.playerY = event.clientY;
    },
    spawnBalls() {
      for (let i = 0; i < 4; i++) {
        this.balls.push({
          x: Math.random() * 360 + 20,
          y: Math.random() * 360 + 20,
          speedX: Math.random() * 4 - 1,
          speedY: Math.random() * 4 - 1
        });
      }
    }
  }
});
</script>

<style scoped>
.kollision {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgb(var(--v-theme-toolbar));
}
</style>
