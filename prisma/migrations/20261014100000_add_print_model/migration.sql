-- Стара таблиця Print з init-міграції (категорія-enum, без slug) не використовувалась.
-- Замінюємо її новою структурою (назва, опис, категорія-текст, фото, showOnHome).
ALTER TABLE "Product" DROP CONSTRAINT IF EXISTS "Product_printId_fkey";
DROP TABLE IF EXISTS "Print";

-- CreateTable
CREATE TABLE "Print" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "category" TEXT,
    "image" TEXT NOT NULL,
    "showOnHome" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Print_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Print_slug_key" ON "Print"("slug");
