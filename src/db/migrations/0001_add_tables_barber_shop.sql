CREATE TABLE "barber_shop_hour" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barber_shop_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"open_time" time NOT NULL,
	"close_time" time NOT NULL,
	"is_closed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "barber_shop_phone" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"barber_shop_id" uuid NOT NULL,
	"phone" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "barber_shop" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text NOT NULL,
	"image_url" varchar NOT NULL,
	"street" varchar NOT NULL,
	"number" varchar,
	"neighborhood" varchar NOT NULL,
	"city" varchar NOT NULL,
	"state" varchar NOT NULL,
	"zip_code" varchar NOT NULL,
	"barber_user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "barber_shop_hour" ADD CONSTRAINT "barber_shop_hour_barber_shop_id_barber_shop_id_fk" FOREIGN KEY ("barber_shop_id") REFERENCES "public"."barber_shop"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_shop_phone" ADD CONSTRAINT "barber_shop_phone_barber_shop_id_barber_shop_id_fk" FOREIGN KEY ("barber_shop_id") REFERENCES "public"."barber_shop"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "barber_shop" ADD CONSTRAINT "barber_shop_barber_user_id_user_id_fk" FOREIGN KEY ("barber_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;