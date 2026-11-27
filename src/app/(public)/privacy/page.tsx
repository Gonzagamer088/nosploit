import LegalView from "@/components/LegalView";
import { getLegalPage } from "@/lib/legal";

export const dynamic = "force-dynamic";
export const metadata = { title: "Privacy Policy" };

export default async function Privacy() {
  return <LegalView {...await getLegalPage("privacy")} />;
}
