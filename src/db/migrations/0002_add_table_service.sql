CREATE TABLE "service" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barber_shop_id" uuid NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL,
	"image_url" varchar NOT NULL,
	"price_in_cents" integer NOT NULL,
	"duration_minutes" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "service" ADD CONSTRAINT "service_barber_shop_id_barber_shop_id_fk" FOREIGN KEY ("barber_shop_id") REFERENCES "public"."barber_shop"("id") ON DELETE no action ON UPDATE no action;