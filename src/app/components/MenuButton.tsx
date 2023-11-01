import React, { KeyboardEvent } from "react";
import { MoreHorizontal } from "lucide-react";

interface MenuButtonProps {
  onMenuClick: () => void;
}

function MenuButton({ onMenuClick }: MenuButtonProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      onMenuClick();
    }
  };

  return (
    <div id="buttonMenuContainer" className="w-full flex flex-row justify-end">
      <div
        id="buttonMenuBg"
        onClick={onMenuClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        className="bg-neutral-200 dark:bg-neutral-800 rounded-xl w-12 h-11 flex justify-center items-end mt-5 mr-5"
      >
        <MoreHorizontal className="mb-1" />
      </div>
    </div>
  );
}

export default MenuButton;
