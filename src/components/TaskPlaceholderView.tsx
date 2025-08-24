import React, {ReactNode} from 'react';
import Image from "next/image";

type TaskPlaceholderViewProps = {
  messages?: ReactNode[] | null;
}

const TaskPlaceholderView = ({messages}:TaskPlaceholderViewProps) => {
  return (
    <div className="flex flex-col w-full h-full items-center justify-evenly p-10 gap-6 null">
      <Image
        src="/list.svg"
        alt="list"
        width={100}
        height={100}
        className="h-full mt-10"
      />
      {messages?.map((m, i) => <span key={i}>{m}</span>)}
    </div>
  );
};

export default TaskPlaceholderView;
