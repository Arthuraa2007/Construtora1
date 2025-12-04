/*
  Warnings:

  - Made the column `imovelId` on table `consultas` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "consultas" DROP CONSTRAINT "consultas_imovelId_fkey";

-- AlterTable
ALTER TABLE "consultas" ALTER COLUMN "imovelId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
