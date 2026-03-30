CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "visitors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone_number" varchar(20),
	"organization" varchar(255) NOT NULL,
	"visit_date" varchar(50) NOT NULL,
	"registered_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "participants" ADD COLUMN "team_id" uuid REFERENCES "teams"("id");
ALTER TABLE "participants" ADD COLUMN "is_team_leader" boolean DEFAULT false NOT NULL;
ALTER TABLE "participants" DROP COLUMN "team_name";
