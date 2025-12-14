import { Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const PendingApproval = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.is_approved) {
      navigate('/dashboard');
    }
  }, [profile, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Niryaat Saathi
          </h1>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-full">
              <Clock className="w-12 h-12 text-amber-600 dark:text-amber-400" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
            Account Under Review
          </h2>

          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Thank you for registering with Niryaat Saathi. Your account is currently under
            review by our admin team. This process typically takes 24-48 hours.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-medium">Company:</span> {profile?.company_name}
              <br />
              <span className="font-medium">IEC Code:</span> {profile?.iec_code}
              <br />
              <span className="font-medium">Role:</span>{' '}
              {profile?.role
                ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
                : ''}

            </p>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            You will receive an email notification once your account is approved.
          </p>

          <button
            onClick={() => signOut()}
            className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium py-2.5 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
