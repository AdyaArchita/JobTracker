import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter, Download, Sparkles, X } from 'lucide-react';
import { getApplications, exportApplicationsCsv } from '../api/applications';
import { getMe, updateProfile } from '../api/auth';
import { Application } from '../types';
import { Layout } from '../components/Layout';
import { KanbanBoard } from '../components/KanbanBoard';
import { ApplicationModal } from '../components/ApplicationModal';
import { AddApplicationModal } from '../components/AddApplicationModal';
import { Button } from '../components/ui/Button';
import { SkeletonBoard } from '../components/ui/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import toast from 'react-hot-toast';

/**
 * Page: DashboardPage
 * Primary application entry point. Composes the Kanban board, 
 * global search/filtering, and job application management modals.
 */
export function DashboardPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [showProfileBanner, setShowProfileBanner] = useState(true);
  const [profileInput, setProfileInput] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // ─── Queries ──────────────────────────────────────────────────────────

  const { data: userData, refetch: refetchUser } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  const {
    data: applications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['applications'],
    queryFn: getApplications,
  });


  const filteredApplications = searchQuery.trim()
    ? applications.filter(
        (app) =>
          app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : applications;

  const handleCardClick = (application: Application) => {
    setSelectedApp(application);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportApplicationsCsv();
    } catch (error) {
      console.error('Failed to export CSV', error);
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileInput.trim()) return;
    try {
      setIsUpdatingProfile(true);
      await updateProfile(profileInput);
      await refetchUser();
      toast.success('Profile summary updated!');
      setShowProfileBanner(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const hasProfile = !!userData?.user.profileSummary;

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8">
        
        {/* Profile Completion Banner */}
        {showProfileBanner && !hasProfile && (
          <div className="mt-6 animate-in slide-in-from-top duration-500">
            <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 p-[1px] shadow-2xl shadow-brand-500/30">
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 bg-brand-950/20 dark:bg-black/40 backdrop-blur-3xl p-6 rounded-[15px]">
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-white/10 rounded-xl border border-white/20 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-white/10">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight uppercase">Unlock personalized AI insights</h3>
                    <p className="text-white/70 text-sm max-w-md leading-relaxed font-semibold">
                      Add a brief professional summary to help your Career Copilot generate more tailored resume bullets and match scores.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-80 group/input">
                    <input
                      type="text"
                      placeholder="e.g. Senior Frontend Dev with 5 years in React..."
                      value={profileInput}
                      onChange={(e) => setProfileInput(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/5 dark:bg-black/20 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/10 transition-all text-sm font-bold pr-10 shadow-inner"
                    />
                  </div>
                  <Button 
                    onClick={handleUpdateProfile} 
                    isLoading={isUpdatingProfile}
                    className="!bg-white !bg-none !text-brand-600 hover:!bg-brand-50 shadow-2xl shadow-white/20 font-black px-8 uppercase tracking-wider"
                    size="sm"
                  >
                    Save
                  </Button>
                  <button 
                    onClick={() => setShowProfileBanner(false)}
                    className="p-2 text-white/40 hover:text-white transition-all hover:rotate-90"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-surface-950 dark:text-white">
              Applications
            </h1>
            <p className="text-sm text-surface-500 mt-1">
              Manage and track your career opportunities
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-base !pl-10 !py-2 !text-sm w-40 sm:w-64 bg-surface-100/50 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-surface-950"
                id="search-input"
              />
            </div>
            
            <button className="p-2 rounded-xl border border-surface-200 dark:border-white/10 text-surface-500 hover:bg-surface-100 dark:hover:bg-white/5 transition-all">
              <Filter className="w-4 h-4" />
            </button>

            <div className="h-8 w-[1px] bg-surface-200 dark:bg-white/10 mx-1" />

            <Button
              variant="secondary"
              onClick={handleExport}
              isLoading={isExporting}
              size="sm"
              icon={<Download className="w-4 h-4" />}
              className="hidden sm:flex"
            >
              Export
            </Button>

            <Button
              onClick={() => setIsAddModalOpen(true)}
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              className="shadow-lg shadow-brand-500/10"
              id="add-application-button"
            >
              Add Application
            </Button>
          </div>
        </div>


        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <SkeletonBoard />
          ) : isError ? (
            <div className="flex items-center justify-center h-full animate-fade-in">
              <div className="text-center glass-card p-10 max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-lg font-bold text-red-500">Failed to load apps</h3>
                <p className="text-sm text-surface-500 mt-2">There was a problem connecting to the server. Please check your connection.</p>
                <Button variant="secondary" size="sm" className="mt-6" onClick={() => window.location.reload()}>Retry</Button>
              </div>
            </div>
          ) : (
            <ErrorBoundary>
              <KanbanBoard
                applications={filteredApplications}
                onCardClick={handleCardClick}
              />
            </ErrorBoundary>
          )}
        </div>
      </div>


      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <ApplicationModal
        application={selectedApp}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </Layout>
  );
}
