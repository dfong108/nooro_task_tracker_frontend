'use client';
import {CiCirclePlus} from "react-icons/ci";
import Image from "next/image";
import TaskItem from "@/components/TaskItem";


import React, {ReactNode, useEffect, useState} from 'react';
import {Task} from "@/types";
import TaskActionButton from "@/components/TaskActionButton";
import {useRouter} from "next/navigation";
import {taskSeeds} from "../../public/taskSeeds";
import TaskPlaceholderView from "@/components/TaskPlaceholderView";
import {API_CONFIG} from "../../apiConfig";


export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const {clientBaseUrl} = API_CONFIG;
  
  useEffect(() => {
    let cancelled = false;
    
    async function load() {
      try {
        setIsLoading(true);
        if (process.env.NEXT_PUBLIC_USE_SEEDS === 'true') {
          window.setTimeout(() => {
            setTasks(taskSeeds);
          }, 1000)
          setIsLoading(false);
          return
        }
        console.log(`${clientBaseUrl}/api/tasks`)
        const res = await fetch(`${clientBaseUrl}/tasks`);
        if (!res.ok) throw new Error(`Failed to fetch tasks (${res.status})`);
        const {data} = await res.json() as { data: Task[] };
        console.log("Get All Tasks: ", data)
        if (!cancelled) setTasks(data);
        setIsLoading(false);
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
  }, [clientBaseUrl]);
  
  const noTasksFoundMessages: ReactNode[] = [
    <p className="font-bold">You don't have any tasks registered yet.</p>,
    <p>Create tasks and organize your to-do items.</p>
  ];
  
  const loadingTasksMessages: ReactNode[] = [
    <p className="font-bold">Loading Tasks</p>
  ]
  
  // Navigate to the Create Task page
  const handleCreateTask = () => {
    router.push('/tasks/new');
  };
  
  /**
   * Toggles the completion status of a task with the specified ID.
   * Updates the local task state optimistically, then sends a PATCH
   * request to update the task on the server. If the server update fails,
   * the local task state is reverted, and an error is set.
   *
   * @param {string} id - The unique identifier of the task to be toggled.
   * @param {boolean} isCompleted - The new completion status of the task.
   * @throws {Error} If the server request fails, sets an error message in the state.
   */
  const handleToggleCompleteTask = async (taskId: string, nextCompleted: boolean) => {
    try {
      const response = await fetch(`${clientBaseUrl}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({completed: nextCompleted}),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.statusText}`);
      }
      
      const {data: updatedTask} = await response.json();
      
      // Update the tasks list with the new state
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? updatedTask : task
        )
      );
    } catch (error) {
      console.error('Error toggling task completion:', error);
      // Optionally show an error notification to the user
    }
  };
  
  
  /**
   * Deletes a task with the specified ID from the tasks list and sends a DELETE request to the server.
   *
   * This function updates the local state by removing the task with the given ID from the tasks array.
   * It then attempts to delete the task on the server. If the server request fails, the local state
   * is reverted to its previous state and an error message is set.
   *
   * @param {string} id - The unique identifier of the task to be deleted.
   */
  const handleDeleteTask = async (id: string) => {
    const prev = tasks;
    setTasks((curr) => curr.filter((t) => t.id !== id));
    
    if (process.env.NEXT_PUBLIC_USE_SEEDS != 'true') {
      try {
        const res = await fetch(`${clientBaseUrl}/tasks/${id}`, { // Changed from ${clientBaseUrl}/api/tasks/${id}
          method: 'DELETE',
        });
        
        if (!res.ok) throw new Error(`Failed to delete task (${res.status})`);
      } catch (e) {
        setTasks(prev);
        setError(e instanceof Error ? e.message : 'Unknown error');
      }
    }
  };
  
  if (error != null) return <div>Error: {error}</div>;
  
  if (isLoading) return <TaskPlaceholderView messages={loadingTasksMessages}/>;
  
  return (
    <div className="relative flex flex-col w-full min-h-full">
      {/* Create TaskItem Button */}
      <div
        className="absolute -translate-y-1/2 flex w-full"
      >
        <TaskActionButton
          description="Create Task"
          onClick={handleCreateTask}
          icon={<CiCirclePlus size={20}/>}
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
          <TaskPlaceholderView messages={noTasksFoundMessages}/>
          : (
            <ul>
              {tasks?.map(t => (
                <TaskItem
                  key={t.id}
                  task={t}
                  onDelete={handleDeleteTask}
                  onToggle={handleToggleCompleteTask}
                />
              ))}
            </ul>
          )
        }
      
      
      </div>
    </div>
  );
}