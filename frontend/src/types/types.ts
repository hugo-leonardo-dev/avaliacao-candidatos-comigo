export interface Ticket {
  id: number;
  tipo: string;
  motivo: string;
  descricao: string;
  clienteId: number;
  veiculo: string;
  dataAbertura: string;
  prazo: string;
  status: string;
  cliente: Cliente; // Adiciona a propriedade cliente
}

export interface Cliente {
  id: number;
  nome: string;
}

export interface TicketFormProps {
  onSubmit: (ticketData: TicketFormData) => Promise<void>;
  clientes: { id: number; nome: string }[];
}
export interface TicketFormData {
  id?: number; 
  tipo: string;
  motivo: string;
  descricao: string;
  clienteId: number; 
  veiculo: string;
  dataAbertura: string;
  prazo: string;
  status: string;
}


export interface TicketFilterState {
  periodo: string;
  ordenadoPor: string;
  status: string;
  tipo: string;
  motivo: string;
  cliente: string;
  veiculo: string;  
  dataCriacao?: string;
}
