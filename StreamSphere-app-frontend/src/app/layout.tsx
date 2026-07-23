import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MovieProvider } from "@/context/MovieContext";
import { AuthProvider } from "@/context/AuthContext"; // 🔴 Import your new Auth Context
import { Toaster } from "react-hot-toast"; // 🔴 Import the toast container

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StreamSphere",
  description: "Modern streaming platform",
  icons: {
    icon: "/short-logo.svg",
    shortcut: "/short-logo.svg",
    apple: "/short-logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} bg-[#0B0F1A] text-white`}
      >
        {/* 🔴 Wrap everything inside AuthProvider so state is accessible globally */}
        <AuthProvider>
          {/* 🔴 Add Toaster component here so react-hot-toast notifications can pop up anywhere */}
          <Toaster
            position="top-right"
            containerStyle={{ top: 20, right: 20, zIndex: 9999 }}
            toastOptions={{
              style: {
                background: "transparent",
                boxShadow: "none",
                padding: 0,
              },
            }}
          />
          <MovieProvider>
            {children}
          </MovieProvider>
        </AuthProvider>
      </body>
    </html>
  );
}