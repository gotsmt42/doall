import type { Metadata } from "next";

import { termsDoc } from "@/data/legal";
import LegalPage from "@/layouts/LegalPage";
import { getContent } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const doc = termsDoc((await getContent()).contact);
  return pageMetadata({ title: doc.title, description: doc.description, path: "/terms", keywords: ["เงื่อนไขการใช้งาน"] });
}

export default async function Page() {
  return <LegalPage doc={termsDoc((await getContent()).contact)} href="/terms" />;
}
