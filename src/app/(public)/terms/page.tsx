import LegalView from "@/components/LegalView";
import { getLegalPage } from "@/lib/legal";

export const dynamic = "force-dynamic";
export const metadata = { title: "Terms of Service" };

export default async function Terms() {
  return <LegalView {...await getLegalPage("terms")} />;
}
