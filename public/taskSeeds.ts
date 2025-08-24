import type { Task } from "@/types";
import {
  type TaskColor,
  type CreateTaskInput,
  taskColors,
  TaskColorSchema,
  taskColorHex,
} from "@/schemas";

/**
 * Sample task titles for seeding and demos.
 */
const SAMPLE_TITLES = [
  "Buy groceries",
  "Write project report",
  "Go for a run",
  "Plan weekend trip",
  "Call a friend",
  "Read a chapter",
  "Pay utility bills",
  "Clean the kitchen",
  "Review open PRs",
  "Book dentist appointment",
  "Refactor utilities",
  "Backup photos",
] as const;

/**
 * Select a color from the allowed schema colors, round-robin.
 */
function pickColor(i: number): TaskColor {
  return taskColors[i % taskColors.length];
}

/**
 * Create seeds that match the CreateTaskSchema (title + color).
 * Useful for API create requests.
 */
export const createTaskSeeds: CreateTaskInput[] = SAMPLE_TITLES.map(
  (title, i) => ({
    title,
    color: pickColor(i),
  })
);

/**
 * Create full Task-shaped seeds (id + title + completed + color).
 * Color is kept as the schema color name; you can convert to hex when rendering.
 */
export const taskSeeds: Task[] = SAMPLE_TITLES.map((title, i) => ({
  id: `tsk_${String(i + 1).padStart(3, "0")}`,
  title,
  completed: i % 3 === 0, // mark every third task as completed
  color: pickColor(i),
}));

/**
 * Utility: safely convert a task’s color (name) to hex using the schema map.
 * Falls back to the original color string if it’s already a hex or an unknown value.
 */
export function colorToHex(color?: string): string {
  const parsed = TaskColorSchema.safeParse(color);
  if (parsed.success) return taskColorHex[parsed.data];
  
  if (typeof color === "string" && color.startsWith("#")) {
    return color;
  }
  // Fallback for unknown values; callers can override if needed
  return "#3b82f6"; // default to blue-500
}

/**
 * Factory helpers for dynamic seed generation
 */
export function makeCreateTaskSeeds(count: number): CreateTaskInput[] {
  return Array.from({ length: count }, (_, i) => ({
    title: SAMPLE_TITLES[i % SAMPLE_TITLES.length],
    color: pickColor(i),
  }));
}

export function makeTaskSeeds(count: number): Task[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `tsk_${String(i + 1).padStart(3, "0")}`,
    title: SAMPLE_TITLES[i % SAMPLE_TITLES.length],
    completed: i % 3 === 0,
    color: pickColor(i),
  }));
}