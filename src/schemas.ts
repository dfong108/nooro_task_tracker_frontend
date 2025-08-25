import { z } from "zod";

/**
 * Allowed color options for Task items (names).
 * Feel free to reorder these to your preference.
 */
export const taskColors = [
  "RED",
  "ORANGE",
  "YELLOW",
  "GREEN",
  "BLUE",
  "INDIGO",
  "PURPLE",
  "PINK",
  "BROWN",
] as const;

/**
 * Zod enum schema and TS type for task color.
 */
export const TaskColorSchema = z.enum(taskColors);
export type TaskColor = z.infer<typeof TaskColorSchema>;

/**
 * Name -> Hex map for rendering.
 */
export const taskColorHex: Record<TaskColor, string> = {
  RED: "#FF3B30",
  ORANGE: "#FF9500",
  YELLOW: "#FFCC00",
  GREEN: "#34C759",
  BLUE: "#007AFF",
  INDIGO: "#5856D6",
  PURPLE: "#AF52DE",
  PINK: "#FF2D55",
  BROWN: "#A2845E",
};

/**
 * Create TaskItem schema and type.
 * - title: required, non-empty string
 * - color: one of the allowed colors
 */
export const CreateTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  color: TaskColorSchema,
  completed: z.boolean().optional(),
});
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

/**
 * Edit/Update TaskItem schema and type.
 * - id: required (non-empty string)
 * - title, color: required (same as create)
 */
export const UpdateTaskSchema = CreateTaskSchema.extend({
  id: z.string().min(1, "TaskItem id is required"),
});
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

/**
 * Convenience default values for create form.
 */
export const defaultCreateTaskValues: CreateTaskInput = {
  title: "",
  color: "BLUE",
};

/**
 * Helper to safely validate create form values.
 */
export const validateCreateTask = (values: unknown) =>
  CreateTaskSchema.safeParse(values);

/**
 * Helper to safely validate update form values.
 */
export const validateUpdateTask = (values: unknown) =>
  UpdateTaskSchema.safeParse(values);