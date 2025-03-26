import { Navbar } from "@/components/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | Twibbles",
  description: "Search for users and posts on Twibbles",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
