import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  User,
  Building2,
  Package,
  Star,
  Search,
  Shield,
  Truck,
  DollarSign,
  FileText,
} from 'lucide-react';

export const Profile = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'ratings' | 'services'>('profile');
  const [userHsCodes, setUserHsCodes] = useState<string[]>([]);
  const [importers, setImporters] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, [profile]);

  const fetchProfileData = async () => {
    if (!profile) return;

    const { data: hsCodes } = await supabase
      .from('user_hs_codes')
      .select('hs_code')
      .eq('user_id', profile.id);

    if (hsCodes) {
      setUserHsCodes(hsCodes.map((item) => item.hs_code));
    }

    if (profile.role === 'exporter') {
      const { data: importerList } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'importer')
        .eq('is_approved', true)
        .limit(20);

      if (importerList) {
        setImporters(importerList);
      }
    }

    if (profile.role === 'importer') {
      const { data: myRatings } = await supabase
        .from('importer_ratings')
        .select('*, rated_by:profiles!rated_by(*)')
        .eq('importer_id', profile.id);

      if (myRatings) {
        setRatings(myRatings);
      }
    }

    const { data: servicesList } = await supabase
      .from('service_providers')
      .select('*')
      .order('rating', { ascending: false })
      .limit(20);

    if (servicesList) {
      setServices(servicesList);
    }

    setLoading(false);
  };

  const filteredImporters = importers.filter((imp) =>
    imp.company_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = services.filter((service) =>
    service.provider_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getServiceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cha':
      case 'customs':
        return <FileText className="w-5 h-5" />;
      case 'logistics':
      case 'shipping':
        return <Truck className="w-5 h-5" />;
      case 'insurance':
        return <Shield className="w-5 h-5" />;
      case 'finance':
      case 'export finance':
        return <DollarSign className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

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
          Profile & Services
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your profile, ratings, and find service providers
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition border-b-2 ${
                activeTab === 'profile'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <User className="w-5 h-5" />
              My Profile
            </button>
            <button
              onClick={() => setActiveTab('ratings')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition border-b-2 ${
                activeTab === 'ratings'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Star className="w-5 h-5" />
              {profile?.role === 'exporter' ? 'Rate Importers' : 'My Ratings'}
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition border-b-2 ${
                activeTab === 'services'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Services
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold">
                    {profile?.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {profile?.full_name}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                      {profile?.company_name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium capitalize">
                        {profile?.role}
                      </span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium capitalize">
                        {profile?.business_type}
                      </span>
                      {profile?.is_approved && (
                        <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-medium flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Company Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">IEC Code</p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {profile?.iec_code}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Country</p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {profile?.country}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Phone</p>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {profile?.phone_number}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Product HS Codes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {userHsCodes.length > 0 ? (
                      userHsCodes.map((code) => (
                        <span
                          key={code}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium"
                        >
                          {code}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        No HS codes added yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ratings' && (
            <div className="space-y-6">
              {profile?.role === 'exporter' ? (
                <div>
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search importers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredImporters.length > 0 ? (
                      filteredImporters.map((importer) => (
                        <div
                          key={importer.id}
                          className="p-5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                {importer.company_name}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {importer.country}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm font-medium">4.5</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                            IEC: {importer.iec_code}
                          </p>
                          <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition">
                            View & Rate
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="md:col-span-2 text-center py-12">
                        <p className="text-slate-500 dark:text-slate-400">
                          No importers found
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Ratings Received
                  </h3>
                  <div className="space-y-4">
                    {ratings.length > 0 ? (
                      ratings.map((rating) => (
                        <div
                          key={rating.id}
                          className="p-5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
                                {rating.is_anonymous ? '?' : rating.rated_by?.full_name?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">
                                  {rating.is_anonymous
                                    ? 'Anonymous'
                                    : rating.rated_by?.company_name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {new Date(rating.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="w-5 h-5 fill-current" />
                              <span className="font-semibold">{rating.overall_score.toFixed(1)}</span>
                            </div>
                          </div>

                          {rating.review_text && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                              {rating.review_text}
                            </p>
                          )}

                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div className="text-center p-2 bg-white dark:bg-slate-800 rounded">
                              <p className="text-slate-500 dark:text-slate-400 mb-1">Payment</p>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {rating.payment_reliability}/5
                              </p>
                            </div>
                            <div className="text-center p-2 bg-white dark:bg-slate-800 rounded">
                              <p className="text-slate-500 dark:text-slate-400 mb-1">Compliance</p>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {rating.compliance_score}/5
                              </p>
                            </div>
                            <div className="text-center p-2 bg-white dark:bg-slate-800 rounded">
                              <p className="text-slate-500 dark:text-slate-400 mb-1">Disputes</p>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {rating.dispute_history}/5
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-slate-500 dark:text-slate-400">
                          No ratings received yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="p-6 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                          {getServiceIcon(service.service_type)}
                        </div>
                        {service.is_verified && (
                          <span className="flex items-center gap-1 text-xs text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                            <Shield className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                        {service.provider_name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 capitalize">
                        {service.service_type}
                      </p>

                      {service.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                          {service.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{service.rating.toFixed(1)}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            ({service.review_count})
                          </span>
                        </div>
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          Contact
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="lg:col-span-3 text-center py-12">
                    <p className="text-slate-500 dark:text-slate-400">No services found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
