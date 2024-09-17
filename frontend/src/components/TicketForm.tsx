import React, { useState, useEffect  } from 'react';
import { TicketFormData, Cliente } from '../types/types';

interface TicketFormProps {
  onSubmit: (ticketData: TicketFormData) => Promise<void>;
  clientes: Cliente[];
  initialData?: TicketFormData;
  onClose: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, clientes, initialData }) => {
  const getInitialDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const calculateDueDate = (days: number): string => {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today.toISOString().split('T')[0];
  };
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  const [formData, setFormData] = useState<TicketFormData>({
    tipo: '',
    motivo: '',
    descricao: '',
    clienteId: 0,
    veiculo: '',
    dataAbertura: getInitialDate(),
    prazo: calculateDueDate(3),
    status: 'a_fazer',
  });

  const [selectedTab, setSelectedTab] = useState<'contato' | 'ticket' | 'motivo'>('contato');
  const [contatoPassivo, setContatoPassivo] = useState<'sim' | 'nao' | null>(null);
  const [tipoContato, setTipoContato] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'descricaoMotivo') {
      setFormData(prev => ({
        ...prev,
        descricao: value,
      }));
    } else if (name === 'motivo') {
      let daysToAdd = 3;
      if (value === 'incidente') {
        daysToAdd = 5;
      } else if (value === 'upgrade') {
        daysToAdd = 7;
      }
      setFormData(prev => ({
        ...prev,
        [name]: value,
        prazo: calculateDueDate(daysToAdd),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'clienteId' ? Number(value) : value,
      }));
    }
  };

  const calculaDiasUteis = (reason: string): number => {
    switch (reason) {
      case 'incidente':
        return 5;
      case 'upgrade':
        return 7;
      case 'teste':
        return 3;
      default:
        return 0;
    }
  };

  const diasUteis = calculaDiasUteis(formData.motivo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formatToISO8601 = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toISOString();
      };

      const formattedData = {
        ...formData,
        dataAbertura: formatToISO8601(formData.dataAbertura),
        prazo: formatToISO8601(formData.prazo),
      };

      await onSubmit(formattedData);
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
    }
  };

  const renderContatoTab = () => (
    <div>
      <div className="mb-4">
        <p className="text-lg font-medium">Houve contato passivo?</p>
        <div className="flex space-x-4 mt-2">
          <button
            type="button"
            className={`p-2 w-full border rounded-md ${contatoPassivo === 'sim' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
            onClick={() => {
              setContatoPassivo('sim');
              setTipoContato('');
            }}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="contatoPassivo"
                className="mr-2"
                checked={contatoPassivo === 'sim'}
                onChange={() => {
                  setContatoPassivo('sim');
                  setTipoContato('');
                }}
              />
              Sim
            </div>
            <p className="text-sm">O cliente entrou em contato</p>
          </button>

          <button
            type="button"
            className={`p-2 w-full border rounded-md ${contatoPassivo === 'nao' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
            onClick={() => setContatoPassivo('nao')}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="contatoPassivo"
                className="mr-2"
                checked={contatoPassivo === 'nao'}
                onChange={() => setContatoPassivo('nao')}
              />
              Não
            </div>
            <p className="text-sm">Contato ainda será feito</p>
          </button>
        </div>
      </div>

      {contatoPassivo === 'sim' && (
        <div className="mt-4">
          <label htmlFor="tipoContato" className="block text-sm font-medium text-gray-700">
            Tipo de Contato
          </label>
          <select
            id="tipoContato"
            name="tipoContato"
            value={tipoContato}
            onChange={(e) => setTipoContato(e.target.value)}
            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Selecione o tipo</option>
            <option value="telefone">Telefone</option>
            <option value="email">Email</option>
            <option value="outro">Outro</option>
          </select>
        </div>
      )}

      <div className="mt-4">
        <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">
          Cliente
        </label>
        <select
          id="cliente"
          name="clienteId"
          value={formData.clienteId}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"
          required
        >
          <option value="">Selecione um cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderTicketTab = () => (
    <div>
      <p className="text-lg font-medium mb-2">Qual o intuito deste ticket?</p>
      <div className="space-y-3">
        <label className="flex items-center text-sm cursor-pointer">
          <input
            type="radio"
            name="tipo"
            value="operacional"
            checked={formData.tipo === 'operacional'}
            onChange={handleChange}
            className="mr-2"
          />
          <p className="font-medium">Operacional</p>
        </label>
  
        <label className="flex items-center text-sm cursor-pointer">
          <input
            type="radio"
            name="tipo"
            value="suporte"
            checked={formData.tipo === 'suporte'}
            onChange={handleChange}
            className="mr-2"
          />
          <p className="font-medium">Suporte</p>
        </label>
  
        <label className="flex items-center text-sm cursor-pointer">
          <input
            type="radio"
            name="tipo"
            value="relacionamento"
            checked={formData.tipo === 'relacionamento'}
            onChange={handleChange}
            className="mr-2"
          />
          <p className="font-medium">Relacionamento</p>
        </label>
  
        <label className="flex items-center text-sm cursor-pointer">
          <input
            type="radio"
            name="tipo"
            value="vendas"
            checked={formData.tipo === 'vendas'}
            onChange={handleChange}
            className="mr-2"
          />
          <p className="font-medium">Vendas</p>
        </label>
      </div>
      <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"
        >
          <option value="a_fazer">A Fazer</option>
          <option value="em_andamento">Em Andamento</option>
          <option value="concluido">Concluído</option>
        </select>
      <div className="mt-4">
        <label htmlFor="veiculo" className="block text-sm font-medium text-gray-700">
          Veículo
        </label>
        <input
          id="veiculo"
          name="veiculo"
          value={formData.veiculo}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-1 focus:ring-custom-blue focus:border-custom-blue"
          placeholder="Digite o veículo"
        />
      </div>
    </div>
  );

  const renderMotivoTab = () => (
    <div>
      <p className="text-lg font-medium mb-2">Motivo</p>
      <div className="space-y-3">
        <label className="flex items-center">
          <input
            type="radio"
            name="motivo"
            value="incidente"
            checked={formData.motivo === 'incidente'}
            onChange={handleChange}
            className="mr-2"
          />
          Incidente
        </label>

        <label className="flex items-center">
          <input
            type="radio"
            name="motivo"
            value="upgrade"
            checked={formData.motivo === 'upgrade'}
            onChange={handleChange}
            className="mr-2"
          />
          Upgrade
        </label>

        <label className="flex items-center">
          <input
            type="radio"
            name="motivo"
            value="teste"
            checked={formData.motivo === 'teste'}
            onChange={handleChange}
            className="mr-2"
          />
          Teste
        </label>
      </div>
      <div className="mt-4">
        <p className="block text-sm font-medium text-custom-blue">
          Prazo Estimado: {new Date(formData.prazo).toLocaleDateString('pt-BR')}
        </p>
        <p>Informe o cliente que a resolução deste motivo está prevista em {diasUteis} dias úteis.</p>
      </div>
      <div className="mt-4">
        <label htmlFor="descricaoMotivo" className="block text-sm font-medium text-gray-700">
        </label>
        <textarea
          id="descricaoMotivo"
          name="descricaoMotivo"
          value={formData.descricao || ''}
          onChange={handleChange}
          className="mt-1 p-2 block w-full border-2 border-gray-300 rounded-md"
          rows={4}
          placeholder="Informe mais detalhes sobre o ticket"
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-2">
      <div className="space-y-1">
        <p className="text-xs text-gray-600">Formulário de cadastro</p>
        <h1 className="text-2xl font-bold">Novo atendimento ao cliente</h1>
      </div>
      <div className="flex space-x-4">
      <button
        type="button"
        onClick={() => setSelectedTab('contato')}
        className={`text-lg font-semibold ${selectedTab === 'contato' ? 'text-custom-blue border-b-2 border-custom-blue' : 'text-gray-700 border-b-2 border-transparent'} py-3 px-4 transition-colors duration-300`}
      >
        Contato
      </button>
      <button
        type="button"
        onClick={() => setSelectedTab('ticket')}
        className={`text-lg font-semibold ${selectedTab === 'ticket' ? 'text-custom-blue border-b-2 border-custom-blue' : 'text-gray-700 border-b-2 border-transparent'} py-3 px-4 transition-colors duration-300`}
      >
        Ticket
      </button>
      <button
        type="button"
        onClick={() => setSelectedTab('motivo')}
        className={`text-lg font-semibold ${selectedTab === 'motivo' ? 'text-custom-blue border-b-2 border-custom-blue' : 'text-gray-700 border-b-2 border-transparent'} py-3 px-4 transition-colors duration-300`}
      >
        Motivo
      </button>

      </div>

      {selectedTab === 'contato' && renderContatoTab()}
      {selectedTab === 'ticket' && renderTicketTab()}
      {selectedTab === 'motivo' && renderMotivoTab()}

      <div className="flex justify-end space-x-4">
        {selectedTab !== 'motivo' && (
          <button
            type="button"
            onClick={() => setSelectedTab(selectedTab === 'contato' ? 'ticket' : 'motivo')}
            className="px-4 py-2 bg-blue-500 text-white border border-blue-500 rounded-md hover:bg-blue-600"
          >
            Avançar
          </button>
        )}
        {selectedTab === 'motivo' && (
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white border border-green-500 rounded-md hover:bg-green-600"
          >
            Enviar
          </button>
        )}
      </div>
    </form>
  );
};

export default TicketForm;
