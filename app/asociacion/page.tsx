import Socios from "@/components/asociacion/socios";

export default function Asociacion() {
  return (
    <>
      <div className="space-y-4 text-center mt-8">
        <h2 className="text-4xl font-bold">Quiénes somos</h2>

        <p className="text-lg">
          Corría el año 2022, cuando después de aprender durante años esto del
          pádel, alguien dijo:
        </p>

        <p className="italic text-xl font-medium">
          &quot;¿Y por qué no organizamos un torneo?&quot;
        </p>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto px-6 pt-12">
        <h3 className="text-2xl font-semibold border-b pb-2">
          Muchas gracias a nuestros socios
        </h3>
        <Socios />
      </div>

      <div className="space-y-4 pt-12 pb-8 max-w-4xl mx-auto px-6">
        <h4 className="text-xl font-semibold">
          Podéis consultar los estatutos pulsando en los siguientes enlaces
        </h4>

        <ul className="space-y-2 list-disc list-inside">
          <li>
            <a
              href="/asociacion/estatutos_firmados.pdf"
              download="Estatutos.pdf"
              className="hover:underline font-medium"
            >
              Estatutos
            </a>
          </li>

          <li>
            <a
              href="/asociacion/inscripcion_entidade_deportiva.pdf"
              download="Inscripcion.pdf"
              className="hover:underline font-medium"
            >
              Inscripción Entidade Deportiva
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
