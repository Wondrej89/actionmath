export class GameLoop {
    onTick;
    animationFrameId = null;
    lastTimestamp = 0;
    constructor(onTick) {
        this.onTick = onTick;
    }
    start() {
        this.stop();
        this.lastTimestamp = performance.now();
        this.animationFrameId = requestAnimationFrame(this.tick);
    }
    stop() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    tick = (timestamp) => {
        const deltaSeconds = Math.min((timestamp - this.lastTimestamp) / 1000, 0.05);
        this.lastTimestamp = timestamp;
        this.onTick(deltaSeconds);
        this.animationFrameId = requestAnimationFrame(this.tick);
    };
}
//# sourceMappingURL=GameLoop.js.map