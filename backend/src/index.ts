import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import { validateTicket }from "./validateTicket"; 

const app = express();
const port = 3000;

// Instância do Prisma Client
const prisma = new PrismaClient();

// Middleware para processar JSON
app.use(bodyParser.json());

// Criar ticket
app.post('/ticket', async (req: Request, res: Response) => {
  const ticketData = req.body;

  // Validação do ticket
  const errors = validateTicket(ticketData);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const ticket = await prisma.ticket.create({
      data: {
        tipo: ticketData.tipo,
        motivo: ticketData.motivo,
        descricao: ticketData.descricao,
        cliente: ticketData.cliente,
        veiculo: ticketData.veiculo,
        dataAbertura: new Date(ticketData.dataAbertura),
        prazo: new Date(ticketData.prazo),
        status: ticketData.status,
        colaboradorId: ticketData.colaboradorId
      },
    });
    res.status(201).json(ticket);
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    res.status(400).json({ error: 'Erro ao criar ticket' });
  }
});

// Consultar todos os tickets
app.get('/tickets', async (req: Request, res: Response) => {
  const tickets = await prisma.ticket.findMany({
    include: { colaborador: true },
  });
  res.json(tickets);
});

// Consultar um ticket por ID
app.get('/ticket/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticket = await prisma.ticket.findUnique({
    where: { id: Number(id) },
    include: { colaborador: true },
  });
  if (!ticket) return res.status(404).json({ error: 'Ticket não encontrado' });
  res.json(ticket);
});

// Editar um ticket
app.put('/ticket/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticketData = req.body;

  // Validação do ticket
  const errors = validateTicket(ticketData);
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const ticket = await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        tipo: ticketData.tipo,
        motivo: ticketData.motivo,
        descricao: ticketData.descricao,
        cliente: ticketData.cliente,
        veiculo: ticketData.veiculo,
        dataAbertura: new Date(ticketData.dataAbertura),
        prazo: new Date(ticketData.prazo),
        status: ticketData.status,
        colaboradorId: ticketData.colaboradorId
      },
    });
    res.json(ticket);
  } catch (error) {
    console.error('Erro ao editar ticket:', error);
    res.status(400).json({ error: 'Erro ao editar ticket' });
  }
});

// Deletar um ticket
app.delete('/ticket/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.ticket.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar ticket:', error);
    res.status(400).json({ error: 'Erro ao deletar ticket' });
  }
});

// Criar colaborador
app.post('/colaborador', async (req: Request, res: Response) => {
  const { nome, email } = req.body;

  try {
    const colaborador = await prisma.colaborador.create({
      data: { nome, email },
    });
    res.status(201).json(colaborador);
  } catch (error) {
    console.error('Erro ao criar colaborador:', error);
    res.status(400).json({ error: 'Erro ao criar colaborador' });
  }
});

// Consultar todos os colaboradores
app.get('/colaboradores', async (req: Request, res: Response) => {
  const colaboradores = await prisma.colaborador.findMany();
  res.json(colaboradores);
});

// Consultar colaborador por ID
app.get('/colaborador/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const colaborador = await prisma.colaborador.findUnique({
    where: { id: Number(id) },
  });
  if (!colaborador) return res.status(404).json({ error: 'Colaborador não encontrado' });
  res.json(colaborador);
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
