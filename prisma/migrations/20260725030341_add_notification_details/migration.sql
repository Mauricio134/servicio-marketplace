-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('OFFER_ACCEPTED', 'OFFER_INTERESTED');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "offerId" TEXT,
ADD COLUMN     "type" "NotificationType" NOT NULL DEFAULT 'OFFER_ACCEPTED';

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
