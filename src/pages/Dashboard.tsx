import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchSystemInfo } from '../store/slices/systemSlice';
import { fetchInterfaces } from '../store/slices/networkSlice';
import { fetchRules } from '../store/slices/firewallSlice';
import { fetchTunnels } from '../store/slices/vpnSlice';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ServerIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { info } = useSelector((state: RootState) => state.system);
  const { interfaces } = useSelector((state: RootState) => state.network);
  const { rules } = useSelector((state: RootState) => state.firewall);
  const { tunnels } = useSelector((state: RootState) => state.vpn);

  useEffect(() => {
    dispatch(fetchSystemInfo());
    dispatch(fetchInterfaces());
    dispatch(fetchRules());
    dispatch(fetchTunnels());
  }, [dispatch]);

  // CPU kullanımı için veri
  const cpuData = {
    labels: ['Kullanılan', 'Boşta'],
    datasets: [
      {
        data: [info?.cpu.usage || 0, 100 - (info?.cpu.usage || 0)],
        backgroundColor: ['#D9534F', '#F8F9FA'],
        borderColor: ['#D9534F', '#F8F9FA'],
        borderWidth: 1,
      },
    ],
  };

  // Bellek kullanımı için veri
  const memoryData = {
    labels: ['Kullanılan', 'Boşta'],
    datasets: [
      {
        data: [info?.memory.used || 0, info?.memory.free || 0],
        backgroundColor: ['#F0AD4E', '#F8F9FA'],
        borderColor: ['#F0AD4E', '#F8F9FA'],
        borderWidth: 1,
      },
    ],
  };

  // Disk kullanımı için veri
  const diskData = {
    labels: ['Kullanılan', 'Boşta'],
    datasets: [
      {
        data: [info?.disk.used || 0, info?.disk.free || 0],
        backgroundColor: ['#5BC0DE', '#F8F9FA'],
        borderColor: ['#5BC0DE', '#F8F9FA'],
        borderWidth: 1,
      },
    ],
  };

  // Ağ trafiği için örnek veri
  const networkTrafficData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [
      {
        label: 'Gelen Trafik (Mbps)',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: '#D9534F',
        backgroundColor: 'rgba(217, 83, 79, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Giden Trafik (Mbps)',
        data: [28, 48, 40, 19, 86, 27],
        borderColor: '#5BC0DE',
        backgroundColor: 'rgba(91, 192, 222, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      {/* Sistem Bilgileri */}
      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900">Sistem Bilgileri</h2>
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-pfsense-primary rounded-md p-3">
                  <ServerIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">pfSense Sürümü</dt>
                    <dd className="flex items-baseline">
                      <div className="text-lg font-semibold text-gray-900">{info?.version || 'Yükleniyor...'}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-pfsense-secondary rounded-md p-3">
                  <ServerIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Çalışma Süresi</dt>
                    <dd className="flex items-baseline">
                      <div className="text-lg font-semibold text-gray-900">{info?.uptime || 'Yükleniyor...'}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <ShieldCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Güvenlik Duvarı Kuralları</dt>
                    <dd className="flex items-baseline">
                      <div className="text-lg font-semibold text-gray-900">{rules.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <GlobeAltIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">VPN Tünelleri</dt>
                    <dd className="flex items-baseline">
                      <div className="text-lg font-semibold text-gray-900">{tunnels.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sistem Kaynakları */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Sistem Kaynakları</h2>
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-medium text-gray-900">CPU Kullanımı</h3>
              <div className="mt-2 h-48 flex items-center justify-center">
                <div className="w-32 h-32">
                  <Doughnut data={cpuData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-2xl font-bold text-gray-900">{info?.cpu.usage || 0}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-medium text-gray-900">Bellek Kullanımı</h3>
              <div className="mt-2 h-48 flex items-center justify-center">
                <div className="w-32 h-32">
                  <Doughnut data={memoryData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-2xl font-bold text-gray-900">
                  {info ? Math.round((info.memory.used / (info.memory.used + info.memory.free)) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base font-medium text-gray-900">Disk Kullanımı</h3>
              <div className="mt-2 h-48 flex items-center justify-center">
                <div className="w-32 h-32">
                  <Doughnut data={diskData} options={{ cutout: '70%', plugins: { legend: { display: false } } }} />
                </div>
              </div>
              <div className="mt-4 text-center">
                <span className="text-2xl font-bold text-gray-900">
                  {info ? Math.round((info.disk.used / (info.disk.used + info.disk.free)) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ağ Trafiği */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Ağ Trafiği</h2>
        <div className="mt-2 bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <Line
              data={networkTrafficData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Son 24 Saat Ağ Trafiği',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Ağ Arayüzleri */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Ağ Arayüzleri</h2>
        <div className="mt-2 flex flex-col">
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
                        Arayüz
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        IP Adresi
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
                        MAC Adresi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {interfaces.map((iface) => (
                      <tr key={iface.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{iface.name}</div>
                          <div className="text-sm text-gray-500">{iface.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{iface.ipAddress}</div>
                          <div className="text-sm text-gray-500">{iface.subnet}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              iface.status === 'up'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {iface.status === 'up' ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{iface.mac}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;