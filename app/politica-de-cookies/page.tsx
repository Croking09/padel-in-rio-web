import { getCookiePolicy } from "@/app/actions/document-actions";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function Page() {
  const cookiePolicy = await getCookiePolicy();

  return (
    <>
      <h1 className="text-4xl font-bold text-center pt-8 px-8">
        Política de Cookies
      </h1>
      <article className="typeset typeset-docs mx-auto max-w-4xl px-4 py-8">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {cookiePolicy}
        </ReactMarkdown>
      </article>
    </>
  );
}
