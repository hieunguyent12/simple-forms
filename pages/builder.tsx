import Head from "next/head";

import { ExtendedNextPage } from "../types";
import Builder from "../components/Builder";
import { useRouter } from "next/router";

const BuilderPage: ExtendedNextPage = () => {
  const router = useRouter();

  const formID = router.query.formID as string;

  return (
    <div>
      <Head>
        <title>Simple Survey | Builder</title>
      </Head>

      <Builder formID={formID} />
    </div>
  );
};

BuilderPage.auth = true;

export default BuilderPage;
