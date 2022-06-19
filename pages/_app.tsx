import "../styles/globals.css";
import type { AppProps } from "next/app";

import { AuthProvider, useAuth } from "../context/AuthContext";
import { FormsProvider } from "../context/FormsContext";
import { useRouter } from "next/router";

function App({ Component, pageProps }: AppProps) {
  const auth = useAuth();
  const router = useRouter();

  const protectedPage = (Component as any).auth;

  const Container = ({ children }: any) => {
    return (
      <div
        className="w-screen h-screen overflow-auto"
        style={{
          minWidth: "100%",
          minHeight: "100%",
          backgroundColor: "#EDF2F6",
        }}
      >
        {children}
      </div>
    );
  };

  if (auth.state.pending) {
    return null;
  }

  if (!protectedPage) {
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }

  if (!auth.state.isSignedIn && protectedPage) {
    router.replace("/");
    return null;
  }

  if (auth.state.isSignedIn && protectedPage) {
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }

  return null;
}

function AppWithContexts(props: AppProps) {
  return (
    <AuthProvider>
      <FormsProvider>
        <App {...props} />
      </FormsProvider>
    </AuthProvider>
  );
}

export default AppWithContexts;
