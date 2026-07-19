import { getAllSeasonsWithMonths } from "@/app/actions/season-actions";
import CreateSeasonButton from "@/components/liga/admin/temporadas/create-season-button";
import SeasonsClient from "@/components/liga/admin/temporadas/seasons-client";

export default async function Page() {
  const seasons = await getAllSeasonsWithMonths();

  return (
    <>
      <div className="flex flex-col md:grid md:grid-cols-3 items-center py-8 px-4 md:px-8 lg:px-24">
        <div />

        <h1 className="text-4xl font-bold text-center pb-4 md:pb-0">
          Temporadas
        </h1>

        <div className="justify-self-end">
          <CreateSeasonButton />
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-24 pb-8">
        <SeasonsClient seasons={seasons} />
      </div>
    </>
  );
}
