import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "จองคิว"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="page-wrapper null compact-wrapper" id="pageWrapper">

          {children}
        </div>
        </body>

    </html>
  );
}
