import Head from "next/head";

import { ExtendedNextPage } from "../types";
import FormsList from "../components/FormsList";
import { useAuth } from "../context/AuthContext";

const Home: ExtendedNextPage = () => {
  const auth = useAuth();

  return (
    <div className="w-full h-full">
      <Head>
        <title>Simple Survey | Home</title>
      </Head>

      <div className="pt-4 home-container">
        <div className="flex justify-between items-center pr-4">
          <p className="text-gray-800 font-medium text-xl ml-2 sm:ml-0">
            Simple Survey
          </p>
          <p>{auth.state.user.displayName}</p>
        </div>

        <FormsList />
      </div>
    </div>
  );
};

Home.auth = true;

export default Home;
