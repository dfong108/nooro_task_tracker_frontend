'use client';
import {CiCirclePlus} from "react-icons/ci";
import Image from "next/image";
import TaskItem from "@/components/TaskItem";


import React, {useEffect, useState} from 'react';
import {Task} from "@/types";
import TaskActionButton from "@/components/TaskActionButton";


export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001'; // replace PORT as needed
  
  useEffect(() => {
    let cancelled = false;
    
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/tasks`, {
          // include credentials only if your backend needs cookies
          // credentials: 'include',
        });
        if (!res.ok) throw new Error(`Failed to fetch tasks (${res.status})`);
        const data: Task[] = await res.json();
        if (!cancelled) setTasks(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Unknown error');
        }
      }
    }
    
    load();
    return () => {
      cancelled = true;
    };
  }, [API_BASE]);
  
  const handleCreateTask = () => {
    console.log('create task');
  }
  
  const handleDeleteTask = (task:Task) => {
    console.log('delete task', task);
  }
  const handleToggleCompleteTask = (task:Task) => {
    console.log('toggle task', task);
  }
  
  
  // if (error) return <div>Error: {error}</div>;
  
  if (!tasks) return <div>Loading...</div>;
  
  return (
    <div className="relative flex flex-col w-full min-h-full">
      {/* Create TaskItem Button */}
      <div
        className="absolute -translate-y-1/2 flex w-full"
        onClick={handleCreateTask}
      >
        <TaskActionButton
          description="Create Task"
          onClick={handleCreateTask}
        />
      </div>
      
      <div className="h-full pt-10">
        {/* TaskItem Bar */}
        <div className="flex w-full h-full items-center justify-between py-3 border-b-2 border-foreground/10 font-bold">
          <div>
            <span className="text-primary">Tasks</span>
            <span className="mx-2 px-3 rounded-full bg-background2">{tasks.length}</span>
          </div>
          
          <div>
            <span className="text-secondary">Completed</span>
            <span
              className="mx-2 px-3 rounded-full bg-background2">{tasks?.filter(task => task.completed).length}</span>
          </div>
        </div>
        
        {/* TaskItem List */}
        {tasks.length === 0 ?
          (<div className="flex flex-col w-full h-full items-center justify-evenly p-10 gap-6 null">
            <Image
              src="/list.svg"
              alt="list"
              width={100}
              height={100}
              className="h-full mt-10"
            />
            <p className="font-bold">You don't have any tasks registered yet.</p>
            <p>Create tasks and organize your to-do items.</p>
          </div>)
          : (
            <ul>
              {tasks?.map(t => (
                <TaskItem
                  key={t.id}
                  task={t}
                  onDelete={() => handleDeleteTask(t)}
                  onToggle={() => handleToggleCompleteTask(t)}
                />
              ))}
            </ul>
          )
        }
      
      
      </div>
    </div>
  );
}