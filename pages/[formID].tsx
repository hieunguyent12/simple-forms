import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase";
import { ExtendedNextPage, FormType } from "../types";
import QuestionBlock from "../components/QuestionBlock";

const FormSubmissionPage: ExtendedNextPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormType | null>(null);

  const formID = router.query.formID as string;

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
          // TODO: let user know that this form does not exist
          console.log("form does not exist");
        }
      }
    }

    fetchFormData();
  }, [formID]);

  const renderFormContent = () => {
    if (!formData) return;
    // The presence of testData indicates that cypress is rendering this component
    let questions = formData.form_content.questions.map((question) => {
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

  if (!formData) return null;

  return (
    <div>
      <div className="builder-content-container pt-5">
        {renderFormContent()}
        <div className="flex justify-end">
          <button className="rounded-md px-5 py-2 bg-indigo-500 border border-indigo-600 hover:bg-indigo-600 text-white mb-3">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

FormSubmissionPage.auth = true;

export default FormSubmissionPage;
