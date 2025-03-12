import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchRules, addRule, updateRule, deleteRule } from '../store/slices/firewallSlice';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Rule {
  id: string;
  action: 'allow' | 'block' | 'reject';
  protocol: 'any' | 'tcp' | 'udp' | 'icmp';
  source: string;
  destination: string;
  sourcePort: string;
  destinationPort: string;
  description: string;
  enabled: boolean;
}

interface RuleFormData {
  id?: string;
  action: 'allow' | 'block' | 'reject';
  protocol: 'any' | 'tcp' | 'udp' | 'icmp';
  source: string;
  destination: string;
  sourcePort: string;
  destinationPort: string;
  description: string;
  enabled: boolean;
}

const initialFormData: RuleFormData = {
  action: 'allow',
  protocol: 'any',
  source: 'any',
  destination: 'any',
  sourcePort: 'any',
  destinationPort: 'any',
  description: '',
  enabled: true,
};

const Firewall: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rules, loading, error } = useSelector((state: RootState) => state.firewall);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<RuleFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchRules());
  }, [dispatch]);

  const handleOpenModal = (rule?: Rule) => {
    if (rule) {
      setFormData(rule);
      setIsEditing(true);
    } else {
      setFormData(initialFormData);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && formData.id) {
      await dispatch(updateRule(formData as Rule));
    } else {
      await dispatch(addRule(formData));
    }
    
    handleCloseModal();
  };

  const handleDeleteRule = async (id: string) => {
    if (window.confirm('Bu kuralı silmek istediğinizden emin misiniz?')) {
      await dispatch(deleteRule(id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Güvenlik Duvarı Kuralları</h1>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pfsense-primary hover:bg-pfsense-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pfsense-primary"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Yeni Kural Ekle
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Durum
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Eylem
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Protokol
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Kaynak
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Hedef
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Açıklama
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Düzenle</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        Yükleniyor...
                      </td>
                    </tr>
                  ) : rules.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        Henüz kural eklenmemiş
                      </td>
                    </tr>
                  ) : (
                    rules.map((rule) => (
                      <tr key={rule.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              rule.enabled
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {rule.enabled ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              rule.action === 'allow'
                                ? 'bg-green-100 text-green-800'
                                : rule.action === 'block'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {rule.action === 'allow'
                              ? 'İzin Ver'
                              : rule.action === 'block'
                              ? 'Engelle'
                              : 'Reddet'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rule.protocol === 'any' ? 'Herhangi' : rule.protocol.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rule.source}
                          {rule.sourcePort !== 'any' && `:${rule.sourcePort}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rule.destination}
                          {rule.destinationPort !== 'any' && `:${rule.destinationPort}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rule.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleOpenModal(rule)}
                            className="text-pfsense-primary hover:text-pfsense-secondary mr-4"
                          >
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => handleDeleteRule(rule.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {isEditing ? 'Kuralı Düzenle' : 'Yeni Kural Ekle'}
                      </h3>
                      <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label htmlFor="action" className="block text-sm font-medium text-gray-700">
                            Eylem
                          </label>
                          <div className="mt-1">
                            <select
                              id="action"
                              name="action"
                              value={formData.action}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-pfsense-primary focus:border-pfsense-primary block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                              <option value="allow">İzin Ver</option>
                              <option value="block">Engelle</option>
                              <option value="reject">Reddet</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="protocol" className="block text-sm font-medium text-gray-700">
                            Protokol
                          </label>
                          <div className="mt-1">
                            <select
                              id="protocol"
                              name="protocol"
                              value={formData.protocol}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-pfsense-primary focus:border-pfsense-primary block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                              <option value="any">Herhangi</option>
                              <option value="tcp">TCP</option>
                              <option value="udp">UDP</option>
                              <option value="icmp">ICMP</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                            Kaynak
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="source"
                              id="source"
                              value={formData.source}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-pfsense-primary focus:border-pfsense-primary block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="sourcePort" className="block text-sm font-medium text-gray-700">
                            Kaynak Port
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="sourcePort"
                              id="sourcePort"
                              value={formData.sourcePort}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-pfsense-primary focus:border-pfsense-primary block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                            Hedef
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="destination"
                              id="destination"
                              value={formData.destination}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-pfsense-primary focus:border-pfsense-primary block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="destinationPort" className="block text-sm font-medium text-gray-700">
                            Hedef Port
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="destinationPort"
                              id="destinationPort"
                              value={formData.destinationPort}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-pfsense-primary focus:border-pfsense-primary block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Açıklama
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="description"
                              id="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-pfsense-primary focus:border-pfsense-primary block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="enabled"
                                name="enabled"
                                type="checkbox"
                                checked={formData.enabled}
                                onChange={handleInputChange}
                                className="focus:ring-pfsense-primary h-4 w-4 text-pfsense-primary border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="enabled" className="font-medium text-gray-700">
                                Aktif
                              </label>
                              <p className="text-gray-500">Bu kuralı etkinleştir</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pfsense-primary text-base font-medium text-white hover:bg-pfsense-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pfsense-primary sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isEditing ? 'Güncelle' : 'Ekle'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pfsense-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Firewall;