import React from 'react';

type TaskActionButtonProps = {
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  description: string;
  onClick?: () => void;
  icon?: React.ReactNode
}

const TaskActionButton = ({type, disabled, description, onClick, icon}:TaskActionButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className="button flex w-full h-[52px] items-center justify-center bg-primary rounded-lg gap-1 font-extrabold"
      onClick={onClick}
    >
      <span>{description}</span>
      {icon}
    </button>
  );
};

export default TaskActionButton;
