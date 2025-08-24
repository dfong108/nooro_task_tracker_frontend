import TaskList from "@/components/TaskList";

export default function Page() {
  return (
    <main className="flex w-full flex-1 flex-col bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-5xl flex-1 px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <TaskList />
        </div>
      </section>
    </main>
  
  );
}