/*
  Warnings:

  - You are about to drop the column `motivo` on the `consultas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "consultas" DROP COLUMN "motivo",
ADD COLUMN     "imovelId" INTEGER;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
