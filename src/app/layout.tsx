import "./globals.css";
import ClientLayout from "./ClientLayout";
import { AuthProvider } from "./providers/AuthProvider";

export const metadata = {
  title: {
    default: "IMDbX",
    template: "%s | IMDbX",
  },
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <ClientLayout>
          <main className="pt-40 px-6">{children}</main>
        </ClientLayout>
      </body>
    </html>
  );
}
