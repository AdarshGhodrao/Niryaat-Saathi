import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Search, Gift, ExternalLink, Newspaper, Filter, CheckCircle } from 'lucide-react';

export const GovtBenefits = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'schemes' | 'news'>('schemes');
  const [schemes, setSchemes] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    hsCode: '',
    country: '',
    businessType: profile?.business_type || '',
  });

  useEffect(() => {
    fetchSchemes();
    fetchNews();
  }, []);

  const fetchSchemes = async () => {
    const { data } = await supabase
      .from('government_schemes')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (data) {
      setSchemes(data);
    }
    setLoading(false);
  };

  const fetchNews = async () => {
    const { data } = await supabase
      .from('news_feed')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(20);

    if (data) {
      setNews(data);
    }
  };

  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      scheme.scheme_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHsCode =
      !filters.hsCode ||
      (scheme.eligible_hs_codes && scheme.eligible_hs_codes.includes(filters.hsCode));

    const matchesCountry =
      !filters.country ||
      (scheme.eligible_countries && scheme.eligible_countries.includes(filters.country));

    const matchesBusinessType =
      !filters.businessType ||
      (scheme.eligible_business_types &&
        scheme.eligible_business_types.includes(filters.businessType));

    return matchesSearch && matchesHsCode && matchesCountry && matchesBusinessType;
  });

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          Government Benefits
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Explore export schemes, incentives, and policy updates
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('schemes')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition border-b-2 ${
                activeTab === 'schemes'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Gift className="w-5 h-5" />
              Schemes & Incentives
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition border-b-2 ${
                activeTab === 'news'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Newspaper className="w-5 h-5" />
              Trade News & Updates
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={
                  activeTab === 'schemes' ? 'Search schemes...' : 'Search news...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {activeTab === 'schemes' && (
            <div>
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="font-medium text-slate-900 dark:text-white text-sm">
                    Filter Schemes
                  </span>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="HS Code (optional)"
                    value={filters.hsCode}
                    onChange={(e) => setFilters({ ...filters, hsCode: e.target.value })}
                    className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 dark:text-white text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Country (optional)"
                    value={filters.country}
                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                    className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 dark:text-white text-sm"
                  />
                  <select
                    value={filters.businessType}
                    onChange={(e) => setFilters({ ...filters, businessType: e.target.value })}
                    className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 dark:text-white text-sm"
                  >
                    <option value="">All Business Types</option>
                    <option value="msme">MSME</option>
                    <option value="startup">Startup</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {filteredSchemes.length > 0 ? (
                  filteredSchemes.map((scheme) => (
                    <div
                      key={scheme.id}
                      className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800 hover:shadow-lg transition cursor-pointer"
                      onClick={() => setSelectedScheme(scheme)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                          {scheme.scheme_name}
                        </h3>
                        <span className="px-2 py-1 bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs rounded font-medium">
                          {scheme.scheme_type}
                        </span>
                      </div>

                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 line-clamp-3">
                        {scheme.description}
                      </p>

                      {scheme.benefits && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                            Key Benefits:
                          </p>
                          <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                            {scheme.benefits}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {scheme.eligible_business_types &&
                            scheme.eligible_business_types.includes(profile?.business_type) && (
                              <span className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                                <CheckCircle className="w-3 h-3" />
                                Eligible
                              </span>
                            )}
                        </div>
                        {scheme.official_link && (
                          <a
                            href={scheme.official_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Details
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="lg:col-span-2 text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">
                      No schemes found matching your criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-4">
              {filteredNews.length > 0 ? (
                filteredNews.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {item.is_featured && (
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded font-medium">
                              Featured
                            </span>
                          )}
                          {item.category && (
                            <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded">
                              {item.category}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    {item.content && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                        {item.content}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        {item.source && (
                          <span className="text-slate-500 dark:text-slate-400">{item.source}</span>
                        )}
                        {item.sector && (
                          <span className="text-slate-500 dark:text-slate-400">
                            Sector: {item.sector}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 dark:text-slate-400">
                        {new Date(item.published_at).toLocaleDateString()}
                      </span>
                    </div>

                    {item.source_url && (
                      <a
                        href={item.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-3"
                      >
                        Read Full Article
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 dark:text-slate-400">No news found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedScheme && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {selectedScheme.scheme_name}
                  </h2>
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm rounded">
                    {selectedScheme.scheme_type}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {selectedScheme.description && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Description
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">{selectedScheme.description}</p>
                </div>
              )}

              {selectedScheme.benefits && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Benefits</h3>
                  <p className="text-slate-600 dark:text-slate-400">{selectedScheme.benefits}</p>
                </div>
              )}

              {selectedScheme.eligibility_criteria && (
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Eligibility Criteria
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedScheme.eligibility_criteria}
                  </p>
                </div>
              )}

              {selectedScheme.official_link && (
                <a
                  href={selectedScheme.official_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                >
                  Visit Official Page
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
