import React from 'react';
import {CiCirclePlus} from "react-icons/ci";

type TaskActionButtonProps = {
  description: string;
  onClick: () => void;
}

const TaskActionButton = ({description, onClick}:TaskActionButtonProps) => {
  return (
    <button
      className="button flex w-full h-[52px] items-center justify-center bg-primary rounded-lg gap-1 font-extrabold"
      onClick={onClick}
    >
      <span>{description}</span>
      <CiCirclePlus className="text-xl"/>
    </button>
  );
};

export default TaskActionButton;
