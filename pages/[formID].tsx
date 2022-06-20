import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";

import { db } from "../firebase";
import { ExtendedNextPage, FormType } from "../types";
import QuestionBlock from "../components/QuestionBlock";
import { useAuth } from "../context/AuthContext";

const FormSubmissionPage: ExtendedNextPage = () => {
  const router = useRouter();
  const formID = router.query.formID as string;

  const auth = useAuth();
  const [formData, setFormData] = useState<FormType | null>(null);
  const [doesFormExist, setDoesFormExist] = useState(true);

  const recorder = useRef({
    user: auth.state.user.displayName,
    form_id: formID,
    questionsAndChoices: [] as {
      question_id: string;
      option_id: string;
    }[],
  });

  useEffect(() => {
    async function fetchFormData() {
      if (formID && formID !== "") {
        const docRef = doc(db, "forms", formID);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData({
            ...docSnap.data(),
            id: docSnap.id,
          } as FormType);
        } else {
          setDoesFormExist(false);
          // TODO: let user know that this form does not exist
          console.log("form does not exist");
        }
      }
    }

    fetchFormData();
  }, [formID]);

  const submitForm = async () => {
    if (!doesFormExist) return;

    const responsesCollection = collection(db, "responses");

    await addDoc(responsesCollection, recorder.current);
  };

  const selectOption = (question_id: string, option_id: string) => {
    if (doesFormExist) {
      const questionIndex = recorder.current.questionsAndChoices.findIndex(
        (item) => item.question_id === question_id
      );

      // if a response for this question already exist, we replace it to prevent having multiple responses for a single question
      if (questionIndex >= 0) {
        recorder.current.questionsAndChoices[questionIndex] = {
          question_id,
          option_id,
        };
      } else {
        recorder.current.questionsAndChoices.push({
          question_id,
          option_id,
        });
      }
    }
  };

  const renderFormContent = () => {
    if (!formData) return;

    let questions = formData.form_content.questions.map((question) => {
      return (
        <QuestionBlock
          key={question.question_id}
          question={question}
          isInEditingMode={false}
          selectOption={selectOption}
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

  if (!formData) return null;

  return (
    <div>
      <div className="builder-content-container pt-5">
        {renderFormContent()}
        <div className="flex justify-end">
          <button
            onClick={submitForm}
            className="rounded-md px-5 py-2 bg-indigo-500 border border-indigo-600 hover:bg-indigo-600 text-white mb-3"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

FormSubmissionPage.auth = true;

export default FormSubmissionPage;
