-- CreateIndex
CREATE UNIQUE INDEX "Offer_postId_userId_key"
ON "Offer"("postId", "userId");
