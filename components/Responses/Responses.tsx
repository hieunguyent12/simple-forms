import {
  collection,
  where,
  query,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { ActionTypes, useForms } from "../../context/FormsContext";
import { db } from "../../firebase";
import { FormType, QuestionType, ResponseType } from "../../types";

export default function Responses() {
  const router = useRouter();
  const formID = router.query.formID as string;

  const { forms, dispatchFormAction } = useForms();
  const currentForm = forms.find((form) => form.id === formID)!;

  const [responses, setResponses] = useState<ResponseType[]>([]);

  useEffect(() => {
    async function fetchResponses() {
      const responsesCollection = collection(db, "responses");
      const q = query(responsesCollection, where("form_id", "==", formID));

      const querySnapshot = await getDocs(q);

      const responsesDocs: ResponseType[] = [];

      querySnapshot.forEach((doc) => {
        responsesDocs.push({
          response_id: doc.id,
          ...doc.data(),
        } as ResponseType);
      });

      setResponses(responsesDocs);
    }

    fetchResponses();
  }, [formID]);

  const computeResponsesData = () => {
    const questions: any = {};

    responses.forEach((response) => {
      response.questionsAndChoices.forEach((item) => {
        let question = questions[item.question_id];

        if (!question) {
          questions[item.question_id] = {};
        }

        question = questions[item.question_id];

        if (question) {
          const optionCount = question[item.option_id];

          if (optionCount) {
            questions[item.question_id][item.option_id]++;
          } else {
            questions[item.question_id][item.option_id] = 1;
          }
        }
      });
    });

    return questions;
  };

  const data = computeResponsesData();

  const renderShit = (question: QuestionType) => {
    const currentQuestionData = data[question.question_id];

    if (!currentQuestionData) return null;

    return (
      <div>
        {Object.keys(currentQuestionData).map((option_id) => (
          <div className="py-2" key={option_id}>
            {
              question.options.find((option) => option.option_id === option_id)
                ?.option_content
            }{" "}
            ----{">"} {currentQuestionData[option_id]} responses
          </div>
        ))}
      </div>
    );
  };

  if (!currentForm) return null;

  return (
    <div>
      <p className="py-4">{responses.length} Responses</p>

      <div>
        {currentForm.form_content.questions.map((question) => (
          <div
            key={question.question_id}
            className="flex flex-col mb-5 p-4 bg-white rounded-lg shadow-slate-200 shadow-md hover:shadow-slate-300"
          >
            <p
              data-testid="questionContent"
              className="mb-3 font-medium break-words"
            >
              {question.question_content === ""
                ? "Empty question"
                : question.question_content}
            </p>

            <div>
              {/* Count how many responses are selected for a particular option */}
              {renderShit(question)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
