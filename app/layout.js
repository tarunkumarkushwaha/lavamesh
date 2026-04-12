import ReduxProvider from "@/store/Redux";
import "./globals.css";
import BaseLayout from "@/layout/BaseLayout";

export const metadata = {
  title: "LavaMesh | Project Management",
  description: "Local-first, P2P, and pocket-friendly mmm... free .....",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <BaseLayout>
            {children}
          </BaseLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
