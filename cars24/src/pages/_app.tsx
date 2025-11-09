import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ReferralProvider } from "@/context/ReferralContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ReferralProvider>
        <NotificationProvider>
          <Header />
          <Component {...pageProps} />
          <Footer />
          <Toaster />
        </NotificationProvider>
      </ReferralProvider>
    </AuthProvider>
  );
}
