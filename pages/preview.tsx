import { useRouter } from "next/router";

import { ExtendedNextPage } from "../types";
import Preview from "../components/Preview";

const PreviewPage: ExtendedNextPage = () => {
  const router = useRouter();

  const formID = router.query.formID as string;

  return (
    <div>
      <Preview formID={formID} />
    </div>
  );
};

PreviewPage.auth = true;

export default PreviewPage;
