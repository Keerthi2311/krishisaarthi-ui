import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "KrishiSaarthi - ನಮ್ಮ ಕೃಷಿಸಾಥಿ",
  description: "Google AI-powered agriculture assistant for farmers",
  keywords: ["agriculture", "farming", "Karnataka", "AI", "assistant"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased bg-gradient-to-br from-green-50 to-blue-50 min-h-screen font-sans"
      >
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
        {/* Recaptcha container for phone authentication */}
        <div id="recaptcha-container"></div>
      </body>
    </html>
  );
}
