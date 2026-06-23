import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import FloatingPremiumButton from "@/components/ui/FloatingPremiumButton";
import FloatingSupportButton from "@/components/ui/FloatingSupportButton";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata = {
  title: "Cognix | AI Prompt Marketplace",
  description: "Create, discover, bookmark, and manage premium AI prompts.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="flex min-h-full flex-col bg-zinc-950 text-zinc-50 overflow-x-hidden w-full max-w-[100vw] relative" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <div className="flex flex-1 flex-col pt-[81px]">{children}</div>
          <Footer />
          <FloatingPremiumButton />
          <FloatingSupportButton />
          <ToastContainer theme="dark" position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
