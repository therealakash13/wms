/*
  Warnings:

  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Item` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itemId` on the `OrderLine` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "OrderLine" DROP CONSTRAINT "OrderLine_itemId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP CONSTRAINT "Item_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "OrderLine" DROP COLUMN "itemId",
ADD COLUMN     "itemId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderLine" ADD CONSTRAINT "OrderLine_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
