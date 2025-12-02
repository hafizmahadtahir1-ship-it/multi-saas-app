// pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/globals.css"; // Tailwind CSS
import CookieConsent from "../components/CookieConsent";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <CookieConsent />
    </>
  );
}

export default MyApp;