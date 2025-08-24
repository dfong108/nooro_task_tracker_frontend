import { z } from "zod";

/**
 * Allowed color options for the TaskItem form.
 */
export const taskColors = ["red", "blue", "green"] as const;

/**
 * Zod enum schema and TS type for task color.
 */
export const TaskColorSchema = z.enum(taskColors);
export type TaskColor = z.infer<typeof TaskColorSchema>;

/**
 * Create TaskItem schema and type.
 * - title: required, non-empty string
 * - color: one of the allowed colors
 */
export const CreateTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  color: TaskColorSchema,
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
  color: "blue",
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