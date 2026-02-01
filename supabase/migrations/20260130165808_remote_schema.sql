


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."account" (
    "id" "text" NOT NULL,
    "userid" "text" NOT NULL,
    "provider" "text" NOT NULL,
    "providerid" "text" NOT NULL,
    "provideraccountid" "text" NOT NULL,
    "refreshtoken" "text",
    "accesstoken" "text",
    "accesstokenexpiresat" timestamp without time zone,
    "refreshtokenexpiresat" timestamp without time zone,
    "idtoken" "text",
    "createdat" timestamp without time zone DEFAULT "now"(),
    "updatedat" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."account" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."favorites" (
    "id" bigint NOT NULL,
    "user_id" "text" NOT NULL,
    "listing_id" bigint NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."favorites" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."favorites_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."favorites_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."favorites_id_seq" OWNED BY "public"."favorites"."id";



CREATE TABLE IF NOT EXISTS "public"."listings" (
    "id" bigint NOT NULL,
    "user_id" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "address" "text" NOT NULL,
    "move_in" timestamp without time zone NOT NULL,
    "move_out" timestamp without time zone NOT NULL,
    "bedrooms" integer NOT NULL,
    "bathrooms" integer NOT NULL,
    "image" "text",
    "amenities" "text"[],
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "poster_name" "text",
    "search_terms" "text"
);


ALTER TABLE "public"."listings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."listings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."listings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."listings_id_seq" OWNED BY "public"."listings"."id";



CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" bigint NOT NULL,
    "sender_id" "text" NOT NULL,
    "recipient_id" "text" NOT NULL,
    "listing_id" bigint NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "sender_name" "text"
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."messages_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."messages_id_seq" OWNED BY "public"."messages"."id";



CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" bigint NOT NULL,
    "user_id" "text" NOT NULL,
    "type" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "related_id" bigint,
    "read" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."notifications_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."notifications_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."notifications_id_seq" OWNED BY "public"."notifications"."id";



CREATE TABLE IF NOT EXISTS "public"."session" (
    "id" "text" NOT NULL,
    "userid" "text" NOT NULL,
    "token" "text" NOT NULL,
    "expiresat" timestamp without time zone NOT NULL,
    "createdat" timestamp without time zone DEFAULT "now"(),
    "updatedat" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."session" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" "text" NOT NULL,
    "name" "text",
    "email" "text" NOT NULL,
    "emailverified" boolean DEFAULT false,
    "image" "text",
    "createdat" timestamp without time zone DEFAULT "now"(),
    "updatedat" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."user" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."verification" (
    "id" "text" NOT NULL,
    "identifier" "text" NOT NULL,
    "value" "text" NOT NULL,
    "expiresat" timestamp without time zone NOT NULL,
    "createdat" timestamp without time zone,
    "updatedat" timestamp without time zone
);


ALTER TABLE "public"."verification" OWNER TO "postgres";


ALTER TABLE ONLY "public"."favorites" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."favorites_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."listings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."listings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."messages" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."messages_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."notifications" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."notifications_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."account"
    ADD CONSTRAINT "account_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."account"
    ADD CONSTRAINT "account_provider_provideraccountid_key" UNIQUE ("provider", "provideraccountid");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."listings"
    ADD CONSTRAINT "listings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."session"
    ADD CONSTRAINT "session_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."session"
    ADD CONSTRAINT "session_token_key" UNIQUE ("token");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."verification"
    ADD CONSTRAINT "verification_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_account_provider" ON "public"."account" USING "btree" ("provider", "providerid");



CREATE INDEX "idx_account_userid" ON "public"."account" USING "btree" ("userid");



CREATE INDEX "idx_favorites_user_id" ON "public"."favorites" USING "btree" ("user_id");



CREATE INDEX "idx_listings_user_id" ON "public"."listings" USING "btree" ("user_id");



CREATE INDEX "idx_messages_recipient_id" ON "public"."messages" USING "btree" ("recipient_id");



CREATE INDEX "idx_messages_sender_id" ON "public"."messages" USING "btree" ("sender_id");



CREATE INDEX "idx_notifications_user_id" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "idx_session_userid" ON "public"."session" USING "btree" ("userid");



ALTER TABLE ONLY "public"."account"
    ADD CONSTRAINT "account_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."user"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."session"
    ADD CONSTRAINT "session_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."user"("id") ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."account" TO "anon";
GRANT ALL ON TABLE "public"."account" TO "authenticated";
GRANT ALL ON TABLE "public"."account" TO "service_role";



GRANT ALL ON TABLE "public"."favorites" TO "anon";
GRANT ALL ON TABLE "public"."favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."favorites" TO "service_role";



GRANT ALL ON SEQUENCE "public"."favorites_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."favorites_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."favorites_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."listings" TO "anon";
GRANT ALL ON TABLE "public"."listings" TO "authenticated";
GRANT ALL ON TABLE "public"."listings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."listings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."listings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."listings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notifications_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."session" TO "anon";
GRANT ALL ON TABLE "public"."session" TO "authenticated";
GRANT ALL ON TABLE "public"."session" TO "service_role";



GRANT ALL ON TABLE "public"."user" TO "anon";
GRANT ALL ON TABLE "public"."user" TO "authenticated";
GRANT ALL ON TABLE "public"."user" TO "service_role";



GRANT ALL ON TABLE "public"."verification" TO "anon";
GRANT ALL ON TABLE "public"."verification" TO "authenticated";
GRANT ALL ON TABLE "public"."verification" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


