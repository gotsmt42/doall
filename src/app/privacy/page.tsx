import type { Metadata } from "next";

import { privacyDoc } from "@/data/legal";
import LegalPage from "@/layouts/LegalPage";
import { getContent } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const doc = privacyDoc((await getContent()).contact);
  return pageMetadata({ title: doc.title, description: doc.description, path: "/privacy", keywords: ["นโยบายความเป็นส่วนตัว"] });
}

export default async function Page() {
  return <LegalPage doc={privacyDoc((await getContent()).contact)} href="/privacy" />;
}
