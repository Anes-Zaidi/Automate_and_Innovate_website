ALTER TABLE "participants" ADD CONSTRAINT "participants_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "visitors" ADD CONSTRAINT "visitors_email_unique" UNIQUE("email");