import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Asociacion() {
  return (
    <>
      <div className="space-y-4 text-center mt-8 px-8">
        <h1 className="text-4xl font-bold">Quiénes somos</h1>

        <p className="text-lg">
          Corría el año 2022, cuando después de aprender durante años esto del
          pádel, alguien dijo:
        </p>

        <p className="italic text-xl font-medium">
          &quot;¿Y por qué no organizamos un torneo?&quot;
        </p>
      </div>

      <section className="max-w-4xl mx-auto px-8 pt-16">
        <h2 className="text-2xl font-semibold pb-4">Qué hacemos</h2>

        <Separator />

        <div className="mt-4 space-y-4 leading-relaxed">
          <p>
            Esta asociación se fundó con un objetivo claro: impulsar el deporte
            local y fomentar su práctica durante todo el año.
          </p>

          <p>
            Para conseguirlo organizamos diferentes actividades, entre ellas:
          </p>

          <ul className="list-disc list-inside pl-2 space-y-1">
            <li>Liga anual</li>
            <li>Torneos</li>
            <li>Eventos deportivos puntuales</li>
          </ul>

          <p>
            Todo ello pensado para crear comunidad y mantener vivo el pádel en
            nuestra localidad.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-8 pt-16 space-y-4">
        <h2 className="text-2xl font-semibold">Los Socios</h2>

        <Separator />

        <p>
          Nada de esto sería posible sin nuestros socios. Gracias a ellos el
          proyecto sigue creciendo año tras año.
        </p>

        <p>
          Tú también puedes formar parte de la asociación. Ser socio te permite
          participar en la liga local y en todos los eventos organizados a lo
          largo del año.
        </p>

        <div className="space-y-2">
          <p className="font-medium">Requisitos:</p>

          <ul className="list-disc list-inside pl-2 space-y-1">
            <li>Ser mayor de edad</li>
            <li>
              Abonar la cuota anual de <span className="font-medium">20€</span>
            </li>
          </ul>
        </div>

        <p>
          Si aún no has cumplido los 18 años, puedes inscribirte como socio
          aspirante. Al alcanzar la mayoría de edad pasarás automáticamente a
          ser socio.
        </p>

        <p>
          Para hacerte socio, contacta con la directiva a través de cualquier
          medio y te guiaremos con los siguientes pasos.
        </p>
      </section>

      <section className="space-y-4 pt-12 pb-8 max-w-4xl mx-auto px-8">
        <h3 className="text-xl font-medium">
          Podéis consultar los estatutos pulsando en los siguientes enlaces
        </h3>

        <ul className="space-y-2 list-disc list-inside">
          <li>
            <Link
              href="/asociacion/estatutos_firmados.pdf"
              download="Estatutos.pdf"
              className="underline"
            >
              Estatutos
            </Link>
          </li>

          <li>
            <Link
              href="/asociacion/inscripcion_entidade_deportiva.pdf"
              download="Inscripcion.pdf"
              className="underline"
            >
              Inscripción Entidade Deportiva
            </Link>
          </li>
        </ul>
      </section>
    </>
  );
}
