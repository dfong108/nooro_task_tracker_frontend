// src/app/tasks/[id]/edit/page.tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import TaskForm from '@/components/TaskForm';
import type { Task } from '@/types';
import {taskSeeds} from "../../../../public/taskSeeds";

type PageProps = { params: { id: string } };

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

async function getTask(id: string): Promise<Task> {
  if (process.env.NEXT_PUBLIC_USE_SEEDS === 'true') return taskSeeds.find(t => t.id === id) ?? notFound();
  
  const res = await fetch(`${API_BASE}/tasks/${id}`, { cache: 'no-store' });
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Failed to load task (${res.status})`);
  return res.json();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const title = 'Edit Task';
  return { title, description: `Edit task ${params.id}` };
}

export default async function Page({ params }: PageProps) {
  const task = await getTask(params.id).then(t => {
    console.log("Get Task: ", t)
    return t
  });
  
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <TaskForm task={task} />
    </main>
  );
}