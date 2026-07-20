alter table "public"."Inscripciones" add column "category" text;

alter table "public"."Inscripciones" add column "player_1_full_name" text;

alter table "public"."Inscripciones" add column "player_2_full_name" text;

alter table "public"."Torneos" add column "categories" text[];

grant delete on table "public"."Inscripciones" to "postgres";

grant insert on table "public"."Inscripciones" to "postgres";

grant references on table "public"."Inscripciones" to "postgres";

grant select on table "public"."Inscripciones" to "postgres";

grant trigger on table "public"."Inscripciones" to "postgres";

grant truncate on table "public"."Inscripciones" to "postgres";

grant update on table "public"."Inscripciones" to "postgres";


