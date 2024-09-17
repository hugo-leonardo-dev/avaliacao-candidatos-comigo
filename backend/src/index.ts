import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { validarTicket } from './validarTicket';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './middleware/authMiddleware'; 

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(bodyParser.json());
const SECRET_KEY = 'senha'; 

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

const verificarPermissao = (acoes: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user.userId;
    if (!userId) return res.status(401).json({ erro: 'ID do usuário é necessário' });

    const usuario = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    if (!acoes.includes(usuario.role)) return res.status(403).json({ erro: 'Permissão negada' });

    next();
  };
};

// LOGIN
app.post('/login', async (req: Request, res: Response) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ erro: 'Login e senha são necessários.' });
  }

  try {
    const usuario = await prisma.user.findUnique({ where: { login } });

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Incluindo role no payload do token
    const token = jwt.sign(
      { userId: usuario.id, role: usuario.role }, 
      SECRET_KEY, 
      { expiresIn: '1h' }
    );

    res.json({ token, role: usuario.role }); // Incluindo role na resposta
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(400).json({ erro: 'Erro ao fazer login' });
  }
});

// REGISTRAR
app.post('/registrar', async (req: Request, res: Response) => {
  const { login, password, role } = req.body;

  if (!login || !password || !role) {
    return res.status(400).json({ erro: 'Login, senha e papel são necessários.' });
  }

  try {
    const usuarioExistente = await prisma.user.findUnique({ where: { login } });
    if (usuarioExistente) {
      return res.status(400).json({ erro: 'Usuário já existe.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const novoUsuario = await prisma.user.create({
      data: {
        login,
        password: passwordHash,
        role: role as Role,
      },
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(400).json({ erro: 'Erro ao criar usuário' });
  }
});

// VER CLIENTES
app.get('/clientes', authenticateToken, async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.colaborador.findMany();
    res.json(clientes);
  } catch (error) {
    console.error('Erro ao consultar clientes:', error);
    res.status(400).json({ erro: 'Erro ao consultar clientes' });
  }
});

// VER TICKETS
app.get('/tickets', authenticateToken, async (req: Request, res: Response) => {
  const { status, motivo, clienteId } = req.query;

  try {
    const filters: any = {};

    if (status) {
      filters.status = status;
    }

    if (motivo) {
      filters.motivo = motivo;
    }

    if (clienteId) {
      filters.clienteId = parseInt(clienteId as string);
    }

    const tickets = await prisma.ticket.findMany({
      where: filters,
      include: {
        cliente: true,
      },
    });

    res.json(tickets);
  } catch (error) {
    console.error('Erro ao consultar tickets:', error);
    res.status(400).json({ erro: 'Erro ao consultar tickets' });
  }
});

// CRIAR TICKET
app.post('/tickets', authenticateToken, verificarPermissao([Role.admin, Role.atendente]), async (req: Request, res: Response) => {
  const ticketData = req.body;
  const erros = validarTicket(ticketData);

  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  try {
    const ticket = await prisma.ticket.create({
      data: {
        tipo: ticketData.tipo,
        motivo: ticketData.motivo,
        descricao: ticketData.descricao,
        clienteId: ticketData.clienteId,
        veiculo: ticketData.veiculo,
        dataAbertura: new Date(ticketData.dataAbertura),
        prazo: new Date(ticketData.prazo),
        status: ticketData.status,
      },
      include: {
        cliente: true,
      },
    });
    res.status(201).json(ticket);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erro ao criar ticket:', error.message);
      res.status(400).json({ erro: 'Erro ao criar ticket', detalhes: error.message });
    } else {
      console.error('Erro inesperado ao criar ticket:', error);
      res.status(500).json({ erro: 'Erro inesperado ao criar ticket' });
    }
  }
});

// EDITAR TICKET
app.put('/tickets/:id', authenticateToken, verificarPermissao([Role.admin, Role.atendente]), async (req: Request, res: Response) => {
  const { id } = req.params;
  const ticketData = req.body;
  const erros = validarTicket(ticketData);

  if (erros.length > 0) {
    return res.status(400).json({ erros });
  }

  try {
    const ticket = await prisma.ticket.update({
      where: { id: Number(id) },
      data: {
        tipo: ticketData.tipo,
        motivo: ticketData.motivo,
        descricao: ticketData.descricao,
        clienteId: ticketData.clienteId,
        veiculo: ticketData.veiculo,
        dataAbertura: new Date(ticketData.dataAbertura),
        prazo: new Date(ticketData.prazo),
        status: ticketData.status,
      },
      include: {
        cliente: true,
      },
    });
    res.json(ticket);
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error);
    res.status(400).json({ erro: 'Erro ao atualizar ticket' });
  }
});

// DELETAR TICKET
app.delete('/tickets/:id', authenticateToken, verificarPermissao([Role.admin]), async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.ticket.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar ticket:', error);
    res.status(400).json({ erro: 'Erro ao deletar ticket' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
