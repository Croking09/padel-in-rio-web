import ReactMarkdown from "react-markdown";
import { getDocument } from "@/app/actions/documents";

export default async function Page() {
  await new Promise((r) => setTimeout(r, 5000));
  const content = await getDocument("league-rules.md");

  return (
    <>
      <h1 className="text-4xl font-bold text-center pt-8 px-8">
        Normativa de la Liga
      </h1>
      <article className="typeset typeset-docs mx-auto max-w-4xl px-4 py-8">
        <ReactMarkdown>{content}</ReactMarkdown>
      </article>
    </>
  );
}
