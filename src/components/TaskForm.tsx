'use client';

import React, {useMemo, useState} from 'react';
import {CiCirclePlus} from "react-icons/ci";
import {useRouter} from 'next/navigation';
import type {Task} from '@/types';
import {
  defaultCreateTaskValues,
  TaskColorSchema,
  type TaskColor,
  taskColors,
  taskColorHex, CreateTaskInput, UpdateTaskInput,
} from '@/schemas';
import {IoArrowBackOutline} from "react-icons/io5";
import TaskActionButton from "@/components/TaskActionButton";
import {FaCheck} from "react-icons/fa";
import {API_CONFIG} from "../../apiConfig";

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
  const initialNewTask:Task = {title:"", color:defaultCreateTaskValues.color, id:"", completed:false};
  
  const [formData, setFormData] = useState<Task>(task ?? initialNewTask)
  /*const [title, setTitle] = useState(task?.title ?? defaultCreateTaskValues.title);
  const [color, setColor] = useState<TaskColor>(resolveInitialColorName(task?.color));
  const [isCompleted, setIsIsCompleted] = useState<boolean>(task?.completed ?? false);*/
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  
  const {clientBaseUrl} = API_CONFIG;
  
  const colorOptions = useMemo(() => taskColors, []);
  
  const isModified = () => {
    const {title, color, completed} = formData;
    return (
      title !== (task?.title ?? defaultCreateTaskValues.title) ||
      color !== resolveInitialColorName(task?.color) ||
      completed !== (task?.completed ?? false)
    );
  }
  
  const handleUpdateFormData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Reset error when user starts typing/changing values
    if (error) setError(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = task?.id
        ? `/api/tasks/${task.id}`
        : '/api/tasks';
      
      const method = task?.id ? 'PUT' : 'POST';
      const {title, color, completed} = formData;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, color, completed }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Failed to save task:', error);
      // Here you might want to show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };
  
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            value={formData.title}
            onChange={(e) => handleUpdateFormData(e)}
            className="form-input"
            placeholder="Ex. Brush your teeth"
            name="title"
          />
        </div>
        
        {/* Color swatches */}
        <fieldset>
          <legend className="form-label">Color</legend>
          <div className="flex gap-1 sm:grid-cols-9">
            {colorOptions.map((name) => {
              const hex = taskColorHex[name];
              const selected = formData.color === name;
              return (
                <label
                  key={name}
                  className={`group relative grid place-items-center rounded-full p-1`}
                  title={name}
                >
                  <input
                    type="radio"
                    id="color"
                    name="color"
                    value={name}
                    checked={selected}
                    onChange={e => handleUpdateFormData(e)}
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
              id="completed"
              name="completed"
              type="checkbox"
              checked={formData.completed}
              onChange={(e) => handleUpdateFormData(e)}
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
          disabled={isSubmitting && !isModified()}
          description={isSubmitting
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