interface Ticket {
  id?: number; // ID opcional para criação
  tipo: string;
  motivo: string;
  descricao: string;
  cliente: string;
  veiculo: string;
  dataAbertura: string;
  prazo: string;
  status: string;
}

export const validateTicket = (ticket: Ticket): string[] => {
  const errors: string[] = [];

  // Validação do tipo (ex: manutenção, revisão)
  if (!ticket.tipo || ticket.tipo.trim() === '') {
    errors.push('O campo "tipo" é obrigatório.');
  }

  // Validação do motivo (motivo não pode estar vazio)
  if (!ticket.motivo || ticket.motivo.trim() === '') {
    errors.push('O campo "motivo" é obrigatório.');
  }

  // Validação da descrição
  if (!ticket.descricao || ticket.descricao.trim() === '') {
    errors.push('O campo "descrição" é obrigatório.');
  }

  // Validação do cliente
  if (!ticket.cliente || ticket.cliente.trim() === '') {
    errors.push('O campo "cliente" é obrigatório.');
  }

  // Validação do veículo
  if (!ticket.veiculo || ticket.veiculo.trim() === '') {
    errors.push('O campo "veículo" é obrigatório.');
  }

  // Validação da data de abertura (formato ISO 8601 completo)
  if (!ticket.dataAbertura || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(ticket.dataAbertura)) {
    errors.push('O campo "data de abertura" deve estar no formato ISO 8601 (YYYY-MM-DDTHH:MM:SSZ).');
  }

  // Validação do prazo (formato ISO 8601 completo)
  if (!ticket.prazo || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(ticket.prazo)) {
    errors.push('O campo "prazo" deve estar no formato ISO 8601 (YYYY-MM-DDTHH:MM:SSZ).');
  }

  // Validação do status (ex: aberto, fechado)
  const validStatuses = ['aberto', 'fechado', 'em andamento'];
  if (!validStatuses.includes(ticket.status)) {
    errors.push(`O campo "status" deve ser um dos seguintes valores: ${validStatuses.join(', ')}.`);
  }

  return errors;
};
