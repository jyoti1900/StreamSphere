export type MovieProgress = {
  lastTime: number;      // seconds watched
  completed: boolean;   // movie finished or not
  rating?: number;      // optional (1–5)
};