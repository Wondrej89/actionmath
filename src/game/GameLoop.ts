export type TickHandler = (deltaSeconds: number) => void;

export class GameLoop {
  private animationFrameId: number | null = null;
  private lastTimestamp = 0;

  constructor(private readonly onTick: TickHandler) {}

  start(): void {
    this.stop();
    this.lastTimestamp = performance.now();
    this.animationFrameId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private tick = (timestamp: number): void => {
    const deltaSeconds = Math.min((timestamp - this.lastTimestamp) / 1000, 0.05);
    this.lastTimestamp = timestamp;
    this.onTick(deltaSeconds);
    this.animationFrameId = requestAnimationFrame(this.tick);
  };
}
