import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

import { PlusSmIcon } from "@heroicons/react/solid";
import { PaperAirplaneIcon, EyeIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

import QuestionBlock from "../QuestionBlock";
import Input from "../Input";
import { ActionTypes, useForms } from "../../context/FormsContext";

export type BuilderProps = {
  formID: string;
};

export default function Builder({ formID }: BuilderProps) {
  const router = useRouter();

  const { forms, dispatchFormAction } = useForms();
  const currentForm = forms.find((form) => form.id === formID);

  const formTitle = currentForm?.form_content.title;
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedFormTitle, setEditedFormTitle] = useState("");

  useEffect(() => {
    // Check the FormsContext to see if we have any data
    // If we don't, we can assume that the user tried to access this page directly (instead of going to /home first, and then click on a form)
    // In this case, we fetch data
  }, []);

  const editForm = () => {
    if (editedFormTitle === formTitle) return;

    dispatchFormAction({
      type: ActionTypes.EDIT_FORM,
      payload: {
        form_id: formID,
        newFormTitle: editedFormTitle,
      },
    });
  };

  const createQuestion = () => {
    if (!formID || Array.isArray(formID)) return;

    dispatchFormAction({
      type: ActionTypes.CREATE_QUESTION,
      payload: {
        form_id: formID,
        question: {
          question_content: "",
          question_id: nanoid(10),
          options: [{ option_id: nanoid(10), option_content: "Choice 1" }],
        },
      },
    });
  };

  const editQuestion = (newContent: string, question_id: string) => {
    dispatchFormAction({
      type: ActionTypes.EDIT_QUESTION,
      payload: {
        form_id: formID,
        newQuestionContent: newContent,
        question_id,
      },
    });
  };

  const createOption = (question_id: string) => {
    dispatchFormAction({
      type: ActionTypes.CREATE_OPTION,
      payload: {
        form_id: formID,
        question_id,
        option: {
          option_id: nanoid(10),
          option_content: "Option",
        },
      },
    });
  };

  const editOption = (
    newOptionContent: string,
    option_id: string,
    question_id: string
  ) => {
    dispatchFormAction({
      type: ActionTypes.EDIT_OPTION,
      payload: {
        form_id: formID,
        question_id,
        option_id,
        newOptionContent,
      },
    });
  };

  const previewForm = () => {
    router.push(`/preview?formID=${router.query.formID}`);
  };

  const share = () => {
    // TODO: generate a code
  };

  return (
    <div>
      <div id="builder" className="builder-content-container pt-5">
        {isEditingTitle ? (
          <Input
            placeholder="Title"
            className="py-2 px-2 w-full text-2xl"
            onBlur={() => {
              setIsEditingTitle(false);
              editForm();
            }}
            value={editedFormTitle}
            onChange={(e) => setEditedFormTitle(e.target.value)}
            onFocus={() => setEditedFormTitle(formTitle || "")}
            autoFocus
          />
        ) : formTitle === "" && !isEditingTitle ? (
          <Input
            placeholder="Title"
            className="py-2 px-2 w-full text-2xl"
            onBlur={() => {
              setIsEditingTitle(false);
              editForm();
            }}
            value={editedFormTitle}
            onChange={(e) => setEditedFormTitle(e.target.value)}
            onFocus={() => setIsEditingTitle(true)}
          />
        ) : (
          <p
            data-testid="title"
            className="text-2xl font-medium text-gray-700 truncate"
            onClick={() => setIsEditingTitle(true)}
          >
            {formTitle}
          </p>
        )}
        <div className="w-full flex justify-between mt-2 mb-4">
          <div data-testid="actionsSection" className="flex items-center">
            <div
              className="flex items-center text-gray-500 p-1 hover:text-indigo-500 hover:bg-indigo-100 rounded-md cursor-pointer"
              onClick={previewForm}
              data-testid="previewBtn"
            >
              <EyeIcon className="w-5 h-5 " />
              <span className="rounded-md ml-1 inline-block">Preview</span>
            </div>
            <div
              className="flex items-center ml-2 text-gray-500 p-1 hover:text-indigo-500 hover:bg-indigo-100 rounded-md cursor-pointer"
              onClick={share}
              data-testid="shareBtn"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
              <span className="rounded-md ml-1 inline-block">Share</span>
            </div>
            <div
              className="flex items-center ml-2 text-gray-500 p-1 hover:text-indigo-500 hover:bg-indigo-100 rounded-md cursor-pointer"
              onClick={() => router.push(`/responses?formID=${formID}`)}
              data-testid="responsesBtn"
            >
              <span>0</span>
              <span className="rounded-md ml-1 inline-block">Responses</span>
            </div>
          </div>
          <div
            className="flex items-center text-gray-500 p-1 hover:text-indigo-500 hover:bg-indigo-100 rounded-md cursor-pointer"
            onClick={createQuestion}
          >
            <PlusSmIcon className="w-5 h-5 " />
            <span className="rounded-md ml-1 inline-block">
              Create question
            </span>
          </div>
        </div>
        {currentForm?.form_content.questions.map((question) => (
          <QuestionBlock
            key={question.question_id}
            question={question}
            isInEditingMode={true}
            editQuestion={editQuestion}
            createOption={createOption}
            editOption={editOption}
          />
        ))}
      </div>
    </div>
  );
}
