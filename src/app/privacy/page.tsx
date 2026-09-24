import { PRIVACY } from "@/data/legal";
import LegalPage from "@/layouts/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: PRIVACY.title,
  description: PRIVACY.description,
  path: "/privacy",
  keywords: ["นโยบายความเป็นส่วนตัว"],
});

export default function Page() {
  return <LegalPage doc={PRIVACY} href="/privacy" />;
}
