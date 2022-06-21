import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";

import { ActionTypes, useForms } from "../context/FormsContext";
import { ExtendedNextPage, FormType } from "../types";
import Responses from "../components/Responses";
import { db } from "../firebase";

const ResponsesPage: ExtendedNextPage = () => {
  const router = useRouter();
  const formID = router.query.formID as string;

  const { forms, dispatchFormAction } = useForms();
  const currentForm = forms.find((form) => form.id === formID);

  useEffect(() => {
    async function fetchForm() {
      const docRef = doc(db, "forms", formID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        dispatchFormAction({
          type: ActionTypes.INITIALIZE_DATA,
          payload: [{ id: docSnap.id, ...docSnap.data() } as FormType],
        });
      } else {
        console.log("form does not exist");
      }
    }

    // this means that the user tried to access this page directly without going to /home first
    if (!(window as any).SIMPLE_FORMS_DATA_INITIALIZED) {
      fetchForm();
    }
    // eslint-disable-next-line
  }, []); // if we use "dispatchFormActions" as a dependency, it will cause an infinite loop

  return (
    <div className="w-full h-full">
      <Head>
        <title>Simple Survey | Responses</title>
      </Head>

      <div className="pt-4 home-container">
        <p className="text-2xl font-medium text-gray-700 truncate">
          {currentForm?.form_content.title}
        </p>
        <Responses />
      </div>
    </div>
  );
};

ResponsesPage.auth = true;

export default ResponsesPage;
