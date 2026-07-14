import ReactMarkdown from "react-markdown";
import { getLeagueRules } from "@/app/actions/document-actions";
import { getActiveSeason } from "@/lib/liga/resolve-season";
import {
  Empty,
  EmptyHeader,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Scale } from "lucide-react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ seasonId?: string }>;
}) {
  const { seasonId } = await getActiveSeason(searchParams);
  const result = await getLeagueRules(seasonId);

  return (
    <>
      <h1 className="text-4xl font-bold text-center py-8 px-8">
        Normativa de la Liga
      </h1>
      <div className="max-w-4xl mx-auto pb-8 px-4">
        {!result.success ? (
          <Empty className="border-2 border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Scale />
              </EmptyMedia>
              <EmptyTitle>Sin reglamento</EmptyTitle>
              <EmptyDescription>
                No hay reglas confirmadas para esta temporada. Aparecerán aquí
                próximamente.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <section className="typeset typeset-docs">
            <ReactMarkdown>{result.content}</ReactMarkdown>
          </section>
        )}
      </div>
    </>
  );
}
