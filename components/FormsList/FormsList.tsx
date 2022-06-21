import { PlusSmIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { FormType } from "../../types";
import { useForms, ActionTypes } from "../../context/FormsContext";
import { nanoid } from "nanoid";

export default function FormsList() {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { forms, dispatchFormAction } = useForms();

  const createForm = () => {
    dispatchFormAction({
      type: ActionTypes.CREATE_FORM,
      payload: {
        id: "", // empty string because we don't have an id yet (id will created by firebase automatically when adding a new document)
        owner_id: auth.state.user.uid,
        form_content: {
          title: "Hiii",
          questions: [
            {
              question_id: nanoid(10),
              question_content: "Test",
              options: [{ option_id: nanoid(10), option_content: "Choice 1" }],
            },
          ],
        },
      },
    });
  };

  useEffect(() => {
    async function fetchForms() {
      const formsCollection = collection(db, "forms");

      const formsQuery = query(
        formsCollection,
        where("owner_id", "==", auth.state.user.uid)
      );
      const formDocs = await getDocs(formsQuery);

      const formsData: FormType[] = [];

      formDocs.forEach(async (doc) => {
        // const questionsQuery = query(collection(db, "forms", doc.id, "questions"));
        // const optionsQuery = query(collection(db, "forms", doc.id, "options"));

        // const questionDocs = await getDocs(questionsQuery);

        // questionDocs.forEach((qDoc) => console.log(qDoc.data()));

        formsData.push({ ...doc.data(), id: doc.id } as FormType);
      });

      setIsLoading(false);

      dispatchFormAction({
        type: ActionTypes.INITIALIZE_DATA,
        payload: formsData,
      });

      (window as any).SIMPLE_FORMS_DATA_INITIALIZED = true;
    }
    fetchForms();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-end pr-3">
        <div className="flex items-center mb-3 mt-5 text-gray-500 p-1 hover:text-indigo-500 hover:bg-indigo-100 rounded-md cursor-pointer">
          <PlusSmIcon className="w-5 h-5 " />
          <span className="rounded-md ml-1 inline-block" onClick={createForm}>
            Create form
          </span>
        </div>
      </div>
      {/* On mobile, we will have one column */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-wrap justify-center sm:justify-start">
          {forms.map((form) => (
            <Link key={form.id} href={`/builder?formID=${form.id}`}>
              <div className="mr-3 mb-3 border border-slate-200 rounded-md w-[45%] sm:w-[204px] bg-slate-50 shadow shadow-slate-200 hover:shadow-slate-300 cursor-pointer hover:border-indigo-300">
                <div className="thumbnail-placeholder block w-full h-32 bg-gray-200 rounded-t-md"></div>

                <div className="p-3">
                  <p>{form.form_content.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
