import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, TrendingUp, TrendingDown, Flame, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const MarketIntel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tradeStats, setTradeStats] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      fetchTradeStats(selectedProduct.hs_code);
    }
  }, [selectedProduct]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('trending_status', { ascending: false })
      .limit(50);

    if (data) {
      setProducts(data);
      if (data.length > 0) {
        setSelectedProduct(data[0]);
      }
    }
    setLoading(false);
  };

  const fetchTradeStats = async (hsCode: string) => {
    const { data } = await supabase
      .from('trade_statistics')
      .select('*')
      .eq('hs_code', hsCode)
      .order('year', { ascending: true })
      .limit(5);

    if (data) {
      setTradeStats(data);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hs_code.includes(searchQuery)
  );

  const getTrendIcon = (status: string) => {
    switch (status) {
      case 'hot':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'stable':
        return <Minus className="w-5 h-5 text-blue-500" />;
      case 'cold':
        return <TrendingDown className="w-5 h-5 text-slate-500" />;
      default:
        return null;
    }
  };

  const getTrendBadge = (status: string) => {
    const styles = {
      hot: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
      stable: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      cold: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    };
    return styles[status as keyof typeof styles] || styles.stable;
  };

  const mockTopCountries = [
    { country: 'United States', value: 245000000, growth: 12.5 },
    { country: 'United Kingdom', value: 189000000, growth: 8.3 },
    { country: 'Germany', value: 156000000, growth: 15.2 },
    { country: 'UAE', value: 134000000, growth: 6.7 },
    { country: 'Japan', value: 98000000, growth: -2.1 },
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
          Market Intelligence
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Explore product trends, market insights, and export opportunities
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by HS Code or Product Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 dark:text-white"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    selectedProduct?.id === product.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                        {product.product_name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        HS: {product.hs_code}
                      </p>
                    </div>
                    {getTrendIcon(product.trending_status)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded border ${getTrendBadge(
                        product.trending_status
                      )}`}
                    >
                      {product.trending_status.toUpperCase()}
                    </span>
                    {product.category && (
                      <span className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                No products found. Try a different search term.
              </p>
            )}
          </div>

          {selectedProduct && (
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {selectedProduct.product_name}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                      HS Code: {selectedProduct.hs_code}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-lg border font-medium ${getTrendBadge(
                      selectedProduct.trending_status
                    )}`}
                  >
                    {selectedProduct.trending_status.toUpperCase()}
                  </span>
                </div>

                {selectedProduct.description && (
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                    {selectedProduct.description}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Market Size
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {selectedProduct.market_size
                        ? `$${(selectedProduct.market_size / 1000000).toFixed(1)}M`
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                      Est. Margin
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {selectedProduct.estimated_margin_min && selectedProduct.estimated_margin_max
                        ? `${selectedProduct.estimated_margin_min}-${selectedProduct.estimated_margin_max}%`
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Category</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {selectedProduct.category || 'General'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Export Growth Trend
                </h3>
                {tradeStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={tradeStats}>
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
                      <Line
                        type="monotone"
                        dataKey="export_value"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ fill: '#2563eb', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-slate-500 dark:text-slate-400 py-12">
                    No trade statistics available for this product
                  </p>
                )}
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Top 5 Importing Countries
                </h3>
                <div className="space-y-3">
                  {mockTopCountries.map((item, idx) => (
                    <div
                      key={item.country}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                          {idx + 1}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {item.country}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900 dark:text-white">
                          ${(item.value / 1000000).toFixed(1)}M
                        </p>
                        <p
                          className={`text-sm ${
                            item.growth > 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {item.growth > 0 ? '+' : ''}
                          {item.growth}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
