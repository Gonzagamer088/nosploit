import { requireUser } from "@/lib/session";
import { canManageStaff } from "@/lib/rbac";
import { LEGAL_SLUGS, getLegalPage } from "@/lib/legal";
import { Field, PageTitle } from "@/components/ui";
import { resetLegalPage, saveLegalPage } from "../../actions";

export default async function LegalEditor() {
  await requireUser(canManageStaff);
  const pages = await Promise.all(LEGAL_SLUGS.map(async (slug) => ({ slug, ...(await getLegalPage(slug)) })));
  return (
    <>
      <PageTitle title="Legal Pages" sub='Format: "## Heading" for headings, "- " for bullet points, blank lines between paragraphs.' />
      <div className="space-y-8">
        {pages.map((p) => (
          <div key={p.slug} className="card">
            <div className="mb-3 flex items-center justify-between">
              <a href={`/${p.slug}`} target="_blank" className="text-sm text-brand-soft">View /{p.slug}</a>
              <span className="badge">{p.custom ? "Customized" : "Default text"}</span>
            </div>
            <form action={saveLegalPage} className="grid gap-3">
              <input type="hidden" name="slug" value={p.slug} />
              <Field label="Title"><input name="title" defaultValue={p.title} required className="input" /></Field>
              <Field label="Content"><textarea name="content" defaultValue={p.content} required rows={18} className="input font-mono" /></Field>
              <div className="flex gap-2">
                <button className="btn-primary">Save</button>
                {p.custom && <button formAction={resetLegalPage} className="btn-ghost">Reset to default</button>}
              </div>
            </form>
          </div>
        ))}
      </div>
    </>
  );
}
