import { COOKIES } from "@/data/legal";
import LegalPage from "@/layouts/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: COOKIES.title,
  description: COOKIES.description,
  path: "/cookies",
  keywords: ["นโยบายคุกกี้"],
});

export default function Page() {
  return <LegalPage doc={COOKIES} href="/cookies" />;
}
