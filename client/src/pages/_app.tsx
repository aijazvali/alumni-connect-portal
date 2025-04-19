import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Authcontext from "@/authcontext/Authcontext";

export default function App({ Component, pageProps }: AppProps) {
  return (
  <>
   <Authcontext>
    <Navbar/>
    <Component {...pageProps} />
    </Authcontext>
  </>
  )
}
