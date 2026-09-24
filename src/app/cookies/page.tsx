import type { Metadata } from "next";

import { cookiesDoc } from "@/data/legal";
import LegalPage from "@/layouts/LegalPage";
import { getContent } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const doc = cookiesDoc((await getContent()).contact);
  return pageMetadata({ title: doc.title, description: doc.description, path: "/cookies", keywords: ["นโยบายคุกกี้"] });
}

export default async function Page() {
  return <LegalPage doc={cookiesDoc((await getContent()).contact)} href="/cookies" />;
}
