'use client';

import React, {useMemo, useState} from 'react';
import {CiCirclePlus} from "react-icons/ci";
import {useRouter} from 'next/navigation';
import type {Task} from '@/types';
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  defaultCreateTaskValues,
  TaskColorSchema,
  type TaskColor,
  taskColors,
  taskColorHex,
} from '@/schemas';
import {IoArrowBackOutline} from "react-icons/io5";
import TaskActionButton from "@/components/TaskActionButton";
import {FaCheck} from "react-icons/fa";

type TaskFormProps = {
  task?: Task | null;
  onSuccess?: (task: Task) => void;
};

function resolveInitialColorName(input?: string | null): TaskColor {
  // If it’s already a valid enum value, use it
  const parsed = TaskColorSchema.safeParse(input);
  if (parsed.success) return parsed.data;
  
  // If a hex was stored previously, try to map back to a named color
  if (typeof input === 'string' && input.startsWith('#')) {
    const found = (Object.entries(taskColorHex) as [TaskColor, string][])
      .find(([, hex]) => hex.toLowerCase() === input.toLowerCase());
    if (found) return found[0];
  }
  
  return defaultCreateTaskValues.color;
}

export default function TaskForm({task, onSuccess}: TaskFormProps) {
  const router = useRouter();
  const isEdit = Boolean(task);
  
  const [title, setTitle] = useState(task?.title ?? defaultCreateTaskValues.title);
  const [color, setColor] = useState<TaskColor>(resolveInitialColorName(task?.color));
  const [completed, setCompleted] = useState<boolean>(task?.completed ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';
  
  const colorOptions = useMemo(() => taskColors, []);
  
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    const baseValues = {title, color};
    const parsed = isEdit
      ? UpdateTaskSchema.safeParse({id: task!.id, ...baseValues})
      : CreateTaskSchema.safeParse(baseValues);
    
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setError(first?.message ?? 'Invalid form data');
      setSubmitting(false);
      return;
    }
    
    try {
      const url = isEdit
        ? `${API_BASE}/api/tasks/${task!.id}`
        : `${API_BASE}/api/tasks`;
      const method = isEdit ? 'PATCH' : 'POST';
      
      if (process.env.NEXT_PUBLIC_USE_SEEDS === 'true') router.push('/');
      
      const res = await fetch(url, {
        method,
        headers: {'Content-Type': 'application/json'},
        // We send the validated fields plus completed (if present in your API)
        body: JSON.stringify({...baseValues, completed}),
      });
      
      if (!res.ok) {
        throw new Error(
          `${isEdit ? 'Failed to update' : 'Failed to create'} task (${res.status})`
        );
      }
      
      const saved: Task = await res.json();
      onSuccess?.(saved);
      router.push('/');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  }
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Back arrow button */}
      <div className="mb-2">
        <IoArrowBackOutline size={20} className="button" onClick={() => router.back()}/>
      </div>
      
      {/* Form Inputs */}
      <div className="space-y-4 my-5">
        <div>
          {/* Title */}
          <label className="form-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="Ex. Brush your teeth"
          />
        </div>
        
        {/* Color swatches */}
        <fieldset>
          <legend className="form-label">Color</legend>
          <div className="flex gap-1 sm:grid-cols-9">
            {colorOptions.map((name) => {
              const hex = taskColorHex[name];
              const selected = color === name;
              return (
                <label
                  key={name}
                  className={`group relative grid place-items-center rounded-full p-1`}
                  title={name}
                >
                  <input
                    type="radio"
                    name="color"
                    value={name}
                    checked={selected}
                    onChange={() => setColor(name)}
                    className="peer sr-only"
                    aria-label={name}
                  />
                  <span
                    className={`block cursor-pointer h-10 w-10 rounded-full ring-2 transition-all ${selected ? 'ring-foreground' : 'ring-transparent group-hover:ring-foreground/40'}`}
                    style={{backgroundColor: hex}}
                  />
                </label>
              );
            })}
          </div>
          {/*<p className="mt-1 text-xs text-foreground/70">
            Selected: {color} ({taskColorHex[color]})
          </p>*/}
        </fieldset>
        
        {/* Mark Complete */}
        {isEdit && (
          <label className="form-label mt-2 inline-flex items-center justify-center space-x-4 text-sm">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="h-4 w-4"
            />
            <span>Mark as complete</span>
          </label>
        )}
      </div>
      
      {/* Form Buttons */}
      <div className="flex items-center gap-3 mt-10">
        <TaskActionButton
          type="submit"
          disabled={submitting}
          description={submitting
            ? (isEdit ? 'Saving…' : 'Creating…')
            : isEdit ? 'Save' : 'Add task'}
          icon={isEdit ? <FaCheck size={20}/> : <CiCirclePlus size={20}/>}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}