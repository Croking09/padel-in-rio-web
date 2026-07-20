import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params?.error ? (
        <p className="text-sm text-muted-foreground">
          Código de error: {params.error}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Ha ocurrido un error inesperado.
        </p>
      )}
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <div className="flex min-h-[80dvh] w-full items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Lo sentimos, algo ha ido mal.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense>
                <ErrorContent searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
