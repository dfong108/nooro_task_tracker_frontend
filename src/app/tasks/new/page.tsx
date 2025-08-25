// src/app/tasks/new/page.tsx
import type { Metadata } from 'next';
import TaskForm from '@/components/TaskForm';

export const metadata: Metadata = {
  title: 'Create Task',
  description: 'Create a new task',
};

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <TaskForm />
    </main>
  );
}