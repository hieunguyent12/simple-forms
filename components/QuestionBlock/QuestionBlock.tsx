import { PlusSmIcon, TrashIcon } from "@heroicons/react/solid";
import { useState } from "react";

import Input from "../Input";
import Option from "../Option";
import { QuestionType } from "../../types";

type CommonProps = {
  question: QuestionType;
  createOption: (question_id: string) => void;
  editQuestion: (newContent: string, id: string) => void;
  editOption: (
    newContent: string,
    question_id: string,
    option_id: string
  ) => void;
};

type Temp = Omit<CommonProps, "question">;

type EditingModeProps = {
  isInEditingMode: true;
  question: CommonProps["question"];
} & {
  [Key in keyof Temp]: Temp[Key];
};

type PreviewModeProps = {
  isInEditingMode: false;
  question: CommonProps["question"];
} & {
  [Key in keyof Temp]?: Temp[Key];
};

export default function QuestionBlock<T>({
  question,
  editQuestion,
  isInEditingMode,
  createOption,
  editOption,
}: EditingModeProps | PreviewModeProps) {
  const [questionContent, setQuestionContent] = useState(
    question.question_content
  );

  const renderActionsFooter = () => {
    if (isInEditingMode) {
      return (
        <div
          className="flex justify-between"
          data-testid="questionActionsFooter"
        >
          <div
            className="flex items-center text-sm text-gray-500 p-1 hover:bg-slate-100 rounded-md cursor-pointer"
            style={{
              width: "119px",
            }}
            onClick={() => createOption(question.question_id)}
          >
            <PlusSmIcon className="w-4 h-4" />
            <span className="rounded-md ml-1 inline-block">Create option</span>
          </div>

          <div
            className="flex items-center text-sm text-red-400 p-1 hover:bg-slate-100 rounded-md cursor-pointer opacity-95"
            style={{
              width: "80px",
            }}
            // onClick={() => removeQuestion && removeQuestion(question.id)}
          >
            <TrashIcon className="w-4 h-4" />
            <span className="rounded-md ml-1 inline-block">Remove</span>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="flex flex-col mb-5 p-4 bg-white rounded-lg shadow-slate-200 shadow-md hover:shadow-slate-300">
      {!isInEditingMode && (
        <p
          data-testid="questionContent"
          className="mb-3 font-medium break-words"
        >
          {questionContent}
        </p>
      )}
      {isInEditingMode && (
        <Input
          placeholder="Question"
          className="py-1 pl-2 mb-3"
          onChange={(e) => setQuestionContent(e.target.value)}
          value={questionContent}
          onBlur={() => editQuestion(questionContent, question.question_id)}
          data-testid="questionInput"
        />
      )}
      <div className="mt-1">
        {question.options.map((option) => (
          <Option
            label={option.option_content}
            id={option.option_id}
            key={option.option_id}
            isInEditingMode={isInEditingMode}
            editOption={(newContent: string, option_id: string) => {
              isInEditingMode &&
                editOption(newContent, option_id, question.question_id);
            }}
          />
        ))}
      </div>
      {renderActionsFooter()}
    </div>
  );
}
