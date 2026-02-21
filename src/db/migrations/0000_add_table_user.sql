CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN', 'BARBER');--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"avatar" varchar,
	"email" varchar NOT NULL,
	"role" "role" DEFAULT 'USER' NOT NULL,
	"password" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
