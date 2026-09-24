import { TERMS } from "@/data/legal";
import LegalPage from "@/layouts/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: TERMS.title,
  description: TERMS.description,
  path: "/terms",
  keywords: ["เงื่อนไขการใช้งาน"],
});

export default function Page() {
  return <LegalPage doc={TERMS} href="/terms" />;
}
