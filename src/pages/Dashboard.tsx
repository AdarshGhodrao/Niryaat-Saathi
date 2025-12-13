import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  TrendingUp,
  TrendingDown,
  Globe,
  Newspaper,
  Gift,
  AlertCircle,
  ArrowUpRight,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userHsCodes, setUserHsCodes] = useState<string[]>([]);
  const [topNews, setTopNews] = useState<any[]>([]);
  const [schemes, setSchemes] = useState<any[]>([]);
  const [tradeStats, setTradeStats] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [profile]);

  const fetchDashboardData = async () => {
    if (!profile) return;

    const { data: hsCodes } = await supabase
      .from('user_hs_codes')
      .select('hs_code')
      .eq('user_id', profile.id);

    if (hsCodes) {
      setUserHsCodes(hsCodes.map((item) => item.hs_code));
    }

    const { data: news } = await supabase
      .from('news_feed')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(3);

    if (news) {
      setTopNews(news);
    }

    const { data: schemesData } = await supabase
      .from('government_schemes')
      .select('*')
      .eq('is_active', true)
      .limit(2);

    if (schemesData) {
      setSchemes(schemesData);
    }

    const { data: stats } = await supabase
      .from('trade_statistics')
      .select('*')
      .order('year', { ascending: true })
      .limit(5);

    if (stats) {
      setTradeStats(stats);
    }

    setLoading(false);
  };

  const mockChartData = [
    { month: 'Jan', value: 45000 },
    { month: 'Feb', value: 52000 },
    { month: 'Mar', value: 48000 },
    { month: 'Apr', value: 61000 },
    { month: 'May', value: 58000 },
    { month: 'Jun', value: 67000 },
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
          Welcome back, {profile?.full_name}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Here's your trade intelligence overview
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-blue-900 dark:text-blue-300 mb-1">
            New Trade Policy Update
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-400">
            DGFT has announced changes to export incentive schemes. Check Govt Benefits for details.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Export Growth
            </span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">+12.5%</p>
          <p className="text-sm text-green-600 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" />
            vs last quarter
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Active Markets
            </span>
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">24</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Countries</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Product HS Codes
            </span>
            <TrendingDown className="w-5 h-5 text-slate-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {userHsCodes.length}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Tracked products</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Eligible Schemes
            </span>
            <Gift className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {schemes.length}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">Available benefits</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Export Trend
            </h2>
            <select className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white">
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>Last 3 Years</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
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
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: '#2563eb', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Trending Countries
          </h2>
          <div className="space-y-4">
            {['United States', 'United Kingdom', 'Germany', 'UAE'].map((country, idx) => (
              <div
                key={country}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-sm">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {country}
                  </span>
                </div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  +{8 - idx}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              Latest Trade News
            </h2>
            <Link
              to="/govt-benefits"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {topNews.length > 0 ? (
              topNews.map((news) => (
                <div
                  key={news.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                    {news.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                    {news.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {news.source}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(news.published_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                No news available. Check back later.
              </p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Eligible Schemes
            </h2>
            <Link
              to="/govt-benefits"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {schemes.length > 0 ? (
              schemes.map((scheme) => (
                <div
                  key={scheme.id}
                  className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
                >
                  <h3 className="font-medium text-slate-900 dark:text-white mb-2">
                    {scheme.scheme_name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {scheme.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 rounded">
                      {scheme.scheme_type}
                    </span>
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Learn More
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                No eligible schemes found. Update your profile.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
