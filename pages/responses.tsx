import Head from "next/head";
import { useRouter } from "next/router";

import { useForms } from "../context/FormsContext";
import { ExtendedNextPage } from "../types";
import Responses from "../components/Responses";

const ResponsesPage: ExtendedNextPage = () => {
  const router = useRouter();
  const formID = router.query.formID as string;

  const { forms } = useForms();
  const currentForm = forms.find((form) => form.id === formID);

  if (!currentForm) return null;

  return (
    <div className="w-full h-full">
      <Head>
        <title>Simple Survey | Responses</title>
      </Head>

      <div className="pt-4 home-container">
        <p className="text-2xl font-medium text-gray-700 truncate">
          {currentForm.form_content.title}
        </p>
        <Responses />
      </div>
    </div>
  );
};

ResponsesPage.auth = true;

export default ResponsesPage;
