-- CreateTable
CREATE TABLE "category_checklist_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "items" JSONB NOT NULL DEFAULT '[]',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_checklist_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_reviews" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "item_id" UUID NOT NULL,
    "reviewed_by" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "notes" TEXT,
    "rejection_reason" TEXT,
    "reviewed_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_review_check_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "review_id" UUID NOT NULL,
    "check_item_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "value" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_review_check_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "category_checklist_templates_category_id_idx" ON "category_checklist_templates"("category_id");

-- CreateIndex
CREATE INDEX "category_checklist_templates_is_active_idx" ON "category_checklist_templates"("is_active");

-- CreateIndex
CREATE INDEX "item_reviews_item_id_idx" ON "item_reviews"("item_id");

-- CreateIndex
CREATE INDEX "item_reviews_reviewed_by_idx" ON "item_reviews"("reviewed_by");

-- CreateIndex
CREATE INDEX "item_reviews_status_idx" ON "item_reviews"("status");

-- CreateIndex
CREATE INDEX "item_reviews_priority_idx" ON "item_reviews"("priority");

-- CreateIndex
CREATE INDEX "item_review_check_items_review_id_idx" ON "item_review_check_items"("review_id");

-- AddForeignKey
ALTER TABLE "category_checklist_templates" ADD CONSTRAINT "category_checklist_templates_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_reviews" ADD CONSTRAINT "item_reviews_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_reviews" ADD CONSTRAINT "item_reviews_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_review_check_items" ADD CONSTRAINT "item_review_check_items_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "item_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
