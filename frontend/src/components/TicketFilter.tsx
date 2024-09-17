// src/components/TicketFilter.tsx
import React, { useEffect, useState } from 'react';
import { TicketFilterState } from '../types/types';

interface TicketFilterProps {
  filter: TicketFilterState;
  onFilterChange: (newFilter: Partial<TicketFilterState>) => void;
  onClearFilters: () => void; 
}

interface Cliente {
  id: number;
  nome: string;
}

const TicketFilter: React.FC<TicketFilterProps> = ({ filter, onFilterChange, onClearFilters }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://localhost:3000/clientes');
        if (!response.ok) {
          throw new Error('Erro ao buscar clientes');
        }
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    onFilterChange({
      [name]: value || '', 
    });
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center flex-wrap gap-4">
        <div className="flex items-center">
          <label htmlFor="ordenadoPor" className="block text-sm font-medium text-custom-blue mr-2 w-18">
            Ordenado Por
          </label>
          <select
            id="ordenadoPor"
            name="ordenadoPor"
            value={filter.ordenadoPor}
            onChange={handleChange}
            className="bg-transparent p-2 rounded-md text-gray-700 w-46"
          >
            <option value="dataAbertura">Data de Abertura</option>
            <option value="prazo">Prazo</option>
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mr-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filter.status || ''}
            onChange={handleChange}
            className="bg-transparent p-2 rounded-md text-gray-700 w-32"
          >
            <option value="" disabled hidden></option>
            <option value="a_fazer">A Fazer</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mr-2">
            Tipo
          </label>
          <select
            id="tipo"
            name="tipo"
            value={filter.tipo || ''}
            onChange={handleChange}
            className="bg-transparent p-2 rounded-md text-gray-700 w-32"
          >
            <option value="" disabled hidden></option>
            <option value="operacional">Operacional</option>
            <option value="suporte">Suporte</option>
            <option value="relacionamento">Relacionamento</option>
            <option value="vendas">Vendas</option>
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mr-2">
            Motivo
          </label>
          <select
            id="motivo"
            name="motivo"
            value={filter.motivo || ''}
            onChange={handleChange}
            className="bg-transparent p-2 rounded-md text-gray-700 w-32"
          >
            <option value="" disabled hidden></option>
            <option value="incidente">Incidente</option>
            <option value="upgrade">Upgrade</option>
            <option value="teste">Teste</option>
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="cliente" className="block text-sm font-medium text-gray-700 mr-2">
            Cliente
          </label>
          <select
            id="cliente"
            name="cliente"
            value={filter.cliente || ''}
            onChange={handleChange}
            className="bg-transparent p-2 rounded-md text-gray-700 min-w-[10px] w-auto"
          >
            <option value="" disabled hidden></option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="veiculo" className="block text-sm font-medium text-gray-700 mr-2">
            Veículo
          </label>
          <input
            id="veiculo"
            name="veiculo"
            type="text"
            value={filter.veiculo || ''}
            onChange={handleChange}
            className="bg-transparent p-2 rounded-md text-gray-700 w-32"
          />
        </div>
        <div className="w-[1px] h-[24px] bg-gray-300 dark:bg-white mx-4"></div> 
        <button
          type="button"
          onClick={onClearFilters}
          className='text-sm text-gray-600' 
        >
          Remover filtros
        </button>
      </div>
    </div>
  );
};

export default TicketFilter;
