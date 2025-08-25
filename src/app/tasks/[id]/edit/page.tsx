import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import TaskForm from '@/components/TaskForm';
import type { Task } from '@/types';

type PageProps = { params: { id: string } };

async function getTask(id: string): Promise<Task> {
  // Make sure to handle relative URLs properly by using the full URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const url = new URL(`/api/tasks/${id}`, baseUrl);
  
  const res = await fetch(url, { 
    cache: 'no-store',
  });
  
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error(`Failed to load task (${res.status})`);
  
  const { data } = await res.json();
  return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await Promise.resolve(params);
  const title = 'Edit Task';
  return { title, description: `Edit task ${id}` };
}

export default async function Page({ params }: PageProps) {
  const { id } = await Promise.resolve(params);
  const task = await getTask(id);
  
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <TaskForm task={task} />
    </main>
  );
}