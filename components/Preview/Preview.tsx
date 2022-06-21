import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import QuestionBlock from "../QuestionBlock";
import { QuestionType } from "../../types";
import { useForms } from "../../context/FormsContext";
import html2canvas from "html2canvas";

export type PreviewProps = {
  formID: string;
  testData?: any;
};

export default function Preview({ testData, formID }: PreviewProps) {
  const { forms } = useForms();

  const currentForm = forms.find((form) => form.id === formID);

  useEffect(() => {
    if (currentForm) {
      html2canvas(document.body, {
        onclone: (document) => {
          const stuff = document.getElementById("__next");
          stuff?.remove();

          const container = document.createElement("div");
          container.className =
            "builder-content-container container-preview-canvas h-screen";

          const titleP = document.createElement("p");
          titleP.innerHTML = currentForm.form_content.title;
          titleP.className =
            "text-2xl font-medium text-gray-700 mb-7 mt-5 mt-2 w-[70%] mx-auto";

          container.appendChild(titleP);

          currentForm.form_content.questions.forEach((question) => {
            const questionBlock = document.createElement("div");
            questionBlock.className =
              "flex mx-auto flex-col w-[70%] p-4 bg-white rounded-lg shadow shadow-slate-200 shadow-md";

            const questionContent = document.createElement("p");
            questionContent.innerHTML = question.question_content;
            questionContent.className = "mb-3 font-medium break-words";

            questionBlock.appendChild(questionContent);

            question.options.forEach((option) => {
              const optionDiv = document.createElement("div");

              optionDiv.innerHTML = option.option_content;
              optionDiv.className = "mb-3";

              questionBlock.appendChild(optionDiv);
            });

            container.appendChild(questionBlock);
          });

          document.body.appendChild(container);
        },
      }).then((canvas) => {});
    }
  }, [currentForm]);

  // if formID = "TEST" then the component is being rendered by cypress and should not return null
  if (!currentForm && formID !== "TEST") {
    return null;
  }

  const renderFormContent = () => {
    // The presence of testData indicates that cypress is rendering this component
    let questions = testData
      ? testData.map((question: QuestionType) => {
          return (
            <QuestionBlock
              key={question.question_id}
              question={question}
              isInEditingMode={false}
            />
          );
        })
      : currentForm!.form_content.questions.map((question) => {
          return (
            <QuestionBlock
              key={question.question_id}
              question={question}
              isInEditingMode={false}
            />
          );
        });

    return (
      <>
        <p
          data-testid="formTitle"
          className="text-2xl font-medium text-gray-700 truncate"
        >
          Form Title
        </p>
        <div className="mt-5">{questions}</div>
      </>
    );
  };

  return (
    <div>
      <div className="builder-content-container pt-5" id="capture">
        {renderFormContent()}
        <div className="flex justify-end">
          <button className="rounded-md px-5 py-2 bg-indigo-500 border border-indigo-600 hover:bg-indigo-600 text-white mb-3">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
