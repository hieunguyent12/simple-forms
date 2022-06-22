import QuestionBlock from "../QuestionBlock";
import { QuestionType } from "../../types";
import { useForms } from "../../context/FormsContext";

export type PreviewProps = {
  formID: string;
  testData?: any;
};

export default function Preview({ testData, formID }: PreviewProps) {
  const { forms } = useForms();

  const currentForm = forms.find((form) => form.id === formID);

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
