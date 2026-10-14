-- Safely extend the existing Print table without deleting its data.
ALTER TABLE "Print"
ADD COLUMN IF NOT EXISTS "slug" TEXT;

ALTER TABLE "Print"
ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN NOT NULL DEFAULT false;

-- Generate unique slugs for existing prints.
UPDATE "Print"
SET "slug" = 'print-' || "id"
WHERE "slug" IS NULL;

-- Make slug mandatory and unique.
ALTER TABLE "Print"
ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Print_slug_key"
ON "Print"("slug");
-- Allow flexible print category names.
ALTER TABLE "Print"
ALTER COLUMN "category" TYPE TEXT
USING "category"::TEXT;

-- Print category can be empty.
ALTER TABLE "Print"
ALTER COLUMN "category" DROP NOT NULL;