import { useEffect, useState, useRef } from "react";
import { XIcon } from "@heroicons/react/solid";

import Input from "../Input";
import RadioInput from "../RadioInput";

// TODO: change color of radio btn
type OptionProps = {
  label: string;
  id: string;
  // updateOption: (optionContent: string) => void;
  // removeOption: () => void;
  isInEditingMode: boolean;
  editOption: (newContent: string, option_id: string) => void;
};

export default function Option({
  label,
  id,
  editOption,
  isInEditingMode,
}: OptionProps) {
  const [optionContent, setOptionContent] = useState(label);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // TODO: listen for ENTER key while editing
  // TODO: only ONE option can be editing as once
  useEffect(() => {
    if (!isInEditingMode) return;

    const _inputEl = inputRef.current;

    const onKeyPress = (e: any) => {
      if (e.keyCode === 13) {
        setIsEditing(false);
        // updateOption(optionContent);
      }
    };

    if (isEditing && _inputEl) {
      _inputEl.addEventListener("keydown", onKeyPress);
    }

    return () => {
      if (_inputEl) {
        _inputEl.removeEventListener("keydown", onKeyPress);
      }
    };
  }, [isEditing, optionContent, isInEditingMode]);

  return (
    <div
      className="group relative flex items-center mb-3 hover:bg-slate-100 rounded-md p-1 cursor-pointer"
      onClick={() => {
        if (isInEditingMode) {
          setIsEditing(true);
        }
      }}
    >
      <RadioInput
        inputId={id}
        label={label}
        disabled={isInEditingMode}
        style={{
          minWidth: "16px",
        }}
      />
      {isEditing ? (
        <Input
          placeholder="Option"
          className="pl-2 ml-2 w-[85%] sm:w-11/12"
          value={optionContent}
          onChange={(e) => setOptionContent(e.target.value)}
          onBlur={() => {
            setIsEditing(false);
            editOption(optionContent, id);
          }}
          autoFocus
          ref={inputRef}
        />
      ) : (
        <label
          htmlFor={id}
          className={`ml-2 text-gray-800 cursor-pointer break-words ${
            isInEditingMode ? "w-[81%] sm:w-[89%]" : "w-[96%]"
          }`}
        >
          {optionContent}
        </label>
      )}

      {isInEditingMode && (
        <span className="absolute right-2" onClick={() => {}}>
          <XIcon className="w-5 h-5 text-gray-400 hover:text-red-400" />
        </span>
      )}
    </div>
  );
}
