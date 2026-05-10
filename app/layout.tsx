import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swap — iPhone Trade-in Estimator",
  description: "Get an instant estimate for your iPhone swap in Nigerian Naira.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
