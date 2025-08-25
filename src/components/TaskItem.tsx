'use client'
import React from "react";
import {Task} from "@/types";
import {FiCheck, FiTrash2} from "react-icons/fi";
import Link from "next/link";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string, nextCompleted: boolean) => void;
  onDelete: (id: string) => void;
};

const TaskItem = ({task, onToggle, onDelete}: TaskItemProps) => {
  const primaryColor = "var(--primary)";
  const secondaryColor = "var(--secondary)";
  
  
  return (
    <li className="flex items-center gap-3 rounded-lg border border-foreground/10 bg-background px-4 py-3">
      
      {/* Complete toggle */}
      <button
        type="button"
        aria-label={task.completed ? "Mark as not completed" : "Mark as completed"}
        onClick={() => onToggle(task.id, !task.completed)}
        className="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/50 cursor-pointer"
        style={{
          borderColor: task.completed ? "transparent" : primaryColor,
          backgroundColor: task.completed ? secondaryColor : "transparent",
        }}
      >
        {task.completed && <FiCheck size={12} style={{color: "var(--foreground)"}}/>}
      </button>
      
      {/* Title */}
      <Link
        className={`flex-1 text-sm sm:text-base hover:underline transition-all duration-500 ${task.completed ? "line-through null" : ""}`}
        href={`/tasks/${task.id}/edit`}>  {/* Updated path */}
        {task.title}
      </Link>
      
      {/* Delete button */}
      <button
        type="button"
        aria-label="Delete task"
        onClick={() => onDelete(task.id)}
        className="shrink-0 rounded p-2 hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-secondary/50 cursor-pointer"
        title="Delete task"
      >
        <FiTrash2 className="text-foreground/70" size={18}/>
      </button>
    </li>
  );
};

export default TaskItem;