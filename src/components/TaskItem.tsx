// src/components/TaskItem.tsx
import React from "react";
import {Task} from "@/types";
import { FiCheck, FiTrash2 } from "react-icons/fi";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string, nextCompleted: boolean) => void;
  onDelete: (id: string) => void;
};

const TaskItem = ({ task, onToggle, onDelete }:TaskItemProps) => {
  // Use the task’s color as the accent for the circle
  const accent = task.color ?? "var(--primary)";

  return (
    <li className="flex items-center gap-3 rounded-lg border border-foreground/10 bg-background px-4 py-3">
      {/* Complete toggle */}
      <button
        type="button"
        aria-label={task.completed ? "Mark as not completed" : "Mark as completed"}
        onClick={() => onToggle(task.id, !task.completed)}
        className="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/50"
        style={{
          borderColor: accent,
          backgroundColor: task.completed ? accent : "transparent",
        }}
      >
        {task.completed && <FiCheck size={12} style={{ color: "var(--background)" }} />}
      </button>

      {/* Title */}
      <span className={`flex-1 text-sm sm:text-base ${task.completed ? "line-through opacity-70" : ""}`}>
        {task.title}
      </span>

      {/* Delete button */}
      <button
        type="button"
        aria-label="Delete task"
        onClick={() => onDelete(task.id)}
        className="shrink-0 rounded p-2 hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-secondary/50"
        title="Delete task"
      >
        <FiTrash2 className="text-foreground/70" size={18} />
      </button>
    </li>
  );
};

export default TaskItem;