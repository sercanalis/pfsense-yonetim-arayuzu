import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchTunnels, addTunnel, updateTunnel, deleteTunnel } from '../store/slices/vpnSlice';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface VPNTunnel {
  id: string;
  name: string;
  type: 'OpenVPN' | 'WireGuard' | 'IPsec';
  status: 'active' | 'inactive' | 'error';
  localNetwork: string;
  remoteNetwork: string;
  description: string;
}

interface TunnelFormData {
  id?: string;
  name: string;
  type: 'OpenVPN' | 'WireGuard' | 'IPsec';
  status: 'active' | 'inactive' | 'error';
  localNetwork: string;
  remoteNetwork: string;
  description: string;
}

const initialFormData: TunnelFormData = {
  name: '',
  type: 'OpenVPN',
  status: 'inactive',
  localNetwork: '',
  remoteNetwork: '',
  description: '',
};

const VPN: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tunnels, loading, error } = useSelector((state: RootState) => state.vpn);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TunnelFormData>(initialFormData);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchTunnels());
  }, [dispatch]);

  const handleOpenModal = (tunnel?: VPNTunnel) => {
    if (tunnel) {
      setFormData(tunnel);
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && formData.id) {
      await dispatch(updateTunnel(formData as VPNTunnel));
    } else {
      await dispatch(addTunnel(formData));
    }
    
    handleCloseModal();
  };

  const handleDeleteTunnel = async (id: string) => {
    if (window.confirm('Bu VPN tünelini silmek istediğinizden emin misiniz?')) {
      await dispatch(deleteTunnel(id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">VPN Tünelleri</h1>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pfsense-primary hover:bg-pfsense-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pfsense-primary"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Yeni Tünel Ekle
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
                      Tünel Adı
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tür
                    </th>
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
                      Yerel Ağ
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Uzak Ağ
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
                  ) : tunnels.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        Henüz VPN tüneli eklenmemiş
                      </td>
                    </tr>
                  ) : (
                    tunnels.map((tunnel) => (
                      <tr key={tunnel.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{tunnel.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tunnel.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              tunnel.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : tunnel.status === 'inactive'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {tunnel.status === 'active'
                              ? 'Aktif'
                              : tunnel.status === 'inactive'
                              ? 'Pasif'
                              : 'Hata'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tunnel.localNetwork}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tunnel.remoteNetwork}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {tunnel.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleOpenModal(tunnel)}
                            className="text-pfsense-primary hover:text-pfsense-secondary mr-4"
                          >
                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => handleDeleteTunnel(tunnel.id)}
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
                        {isEditing ? 'VPN Tünelini Düzenle' : 'Yeni VPN Tüneli Ekle'}
                      </h3>
                      <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Tünel Adı
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="shadow-sm focus:ring-pfsense-primary focus:border-pfsense-primary block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Tür
                          </label>
                          <div className="mt-1">
                            <select
                              id="type"
                              name="type"
                              value={formData.type}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-pfsense-primary focus:border-pfsense-primary block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                              <option value="OpenVPN">OpenVPN</option>
                              <option value="WireGuard">WireGuard</option>
                              <option value="IPsec">IPsec</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Durum
                          </label>
                          <div className="mt-1">
                            <select
                              id="status"
                              name="status"
                              value={formData.status}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-pfsense-primary focus:border-pfsense-primary block w-full sm:text-sm border-gray-300 rounded-md"
                            >
                              <option value="active">Aktif</option>
                              <option value="inactive">Pasif</option>
                              <option value="error">Hata</option>
                            </select>
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="localNetwork" className="block text-sm font-medium text-gray-700">
                            Yerel Ağ
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="localNetwork"
                              id="localNetwork"
                              value={formData.localNetwork}
                              onChange={handleInputChange}
                              required
                              className="shadow-sm focus:ring-pfsense-primary focus:border-pfsense-primary block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label htmlFor="remoteNetwork" className="block text-sm font-medium text-gray-700">
                            Uzak Ağ
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="remoteNetwork"
                              id="remoteNetwork"
                              value={formData.remoteNetwork}
                              onChange={handleInputChange}
                              required
                              className="shadow-sm focus:ring-pfsense-primary focus:border-pfsense-primary block w-full sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-6">
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Açıklama
                          </label>
                          <div className="mt-1">
                            <textarea
                              id="description"
                              name="description"
                              rows={3}
                              value={formData.description}
                              onChange={handleInputChange}
                              className="shadow-sm focus:ring-pfsense-primary focus:border-pfsense-primary block w-full sm:text-sm border-gray-300 rounded-md"
                            />
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

export default VPN;