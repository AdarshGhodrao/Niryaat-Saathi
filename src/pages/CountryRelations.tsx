import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Globe, TrendingUp, FileText, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const CountryRelations = () => {
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [hsCode, setHsCode] = useState('');
  const [tariffInfo, setTariffInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    const { data } = await supabase
      .from('country_relations')
      .select('*')
      .order('country_name', { ascending: true });

    if (data) {
      setCountries(data);
      if (data.length > 0) {
        setSelectedCountry(data[0]);
      }
    }
    setLoading(false);
  };

  const searchTariff = async () => {
    if (!hsCode || !selectedCountry) return;

    const { data } = await supabase
      .from('tariffs')
      .select('*')
      .eq('hs_code', hsCode)
      .eq('country', selectedCountry.country_code)
      .maybeSingle();

    setTariffInfo(data);
  };

  const filteredCountries = countries.filter((c) =>
    c.country_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mockTradeBalance = [
    { year: '2019', exports: 45000, imports: 38000 },
    { year: '2020', exports: 42000, imports: 35000 },
    { year: '2021', exports: 51000, imports: 40000 },
    { year: '2022', exports: 58000, imports: 44000 },
    { year: '2023', exports: 64000, imports: 47000 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Country Relations
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Trade agreements, tariffs, and bilateral relations
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country.id}
                  onClick={() => setSelectedCountry(country)}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selectedCountry?.id === country.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-slate-900 dark:text-white">
                        {country.country_name}
                      </span>
                    </div>
                    {country.fta_status && (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8 text-sm">
                No countries found
              </p>
            )}
          </div>
        </div>

        {selectedCountry && (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {selectedCountry.country_name}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Code: {selectedCountry.country_code}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedCountry.fta_status ? (
                    <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800 text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      FTA Active
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      No FTA
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                    Trade Agreement
                  </p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {selectedCountry.trade_agreement_type || 'WTO'}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Trade Balance</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {selectedCountry.trade_balance
                      ? `$${(selectedCountry.trade_balance / 1000000).toFixed(1)}M`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                India-{selectedCountry.country_name} Trade Balance
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockTradeBalance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="exports" fill="#2563eb" name="Exports" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="imports" fill="#64748b" name="Imports" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Tariff Finder
              </h3>

              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  placeholder="Enter HS Code (e.g., 0901.21)"
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 dark:text-white"
                />
                <button
                  onClick={searchTariff}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                >
                  Search
                </button>
              </div>

              {tariffInfo ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        MFN Tariff Rate
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {tariffInfo.mfn_tariff ? `${tariffInfo.mfn_tariff}%` : 'N/A'}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">
                        Preferential Tariff
                      </p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {tariffInfo.preferential_tariff
                          ? `${tariffInfo.preferential_tariff}%`
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {tariffInfo.required_certifications &&
                    tariffInfo.required_certifications.length > 0 && (
                      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-300 mb-2">
                          Required Certifications
                        </p>
                        <ul className="space-y-1">
                          {tariffInfo.required_certifications.map((cert: string, idx: number) => (
                            <li
                              key={idx}
                              className="text-sm text-amber-800 dark:text-amber-400 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              {cert}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {tariffInfo.import_documents && tariffInfo.import_documents.length > 0 && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                        Required Documents
                      </p>
                      <ul className="space-y-1">
                        {tariffInfo.import_documents.map((doc: string, idx: number) => (
                          <li
                            key={idx}
                            className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2"
                          >
                            <FileText className="w-4 h-4" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : hsCode ? (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  No tariff information found for HS Code: {hsCode}
                </p>
              ) : (
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                  Enter an HS code to view tariff information
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
