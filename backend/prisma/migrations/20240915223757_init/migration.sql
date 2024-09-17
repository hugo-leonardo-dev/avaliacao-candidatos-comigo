-- CreateEnum
CREATE TYPE "Tipo" AS ENUM ('operacional', 'suporte', 'relacionamento', 'vendas');

-- CreateEnum
CREATE TYPE "Motivo" AS ENUM ('incidente', 'upgrade', 'teste');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('a_fazer', 'em_andamento', 'concluido');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'atendente');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "tipo" "Tipo" NOT NULL,
    "motivo" "Motivo" NOT NULL,
    "descricao" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "veiculo" TEXT NOT NULL,
    "dataAbertura" TIMESTAMP(3) NOT NULL,
    "prazo" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Colaborador" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Colaborador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Colaborador_email_key" ON "Colaborador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
