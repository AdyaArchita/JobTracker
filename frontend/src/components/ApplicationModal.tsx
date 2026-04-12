import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Link as LinkIcon,
  Sparkles,
  Copy,
  Check,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  ChevronRight,
  Briefcase,
} from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { MatchScore } from './ui/MatchScore';
import {
  Application,
  ApplicationStatus,
  JOB_TYPES,
  LOCATION_TYPES,
  JobType,
  LocationType,
} from '../types';
import { updateApplication, deleteApplication } from '../api/applications';
import toast from 'react-hot-toast';

interface ApplicationModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_GRADIENTS: Record<ApplicationStatus, string> = {
  'Applied': 'from-brand-500 to-indigo-500',
  'Phone Screen': 'from-blue-500 to-cyan-500',
  'Interview': 'from-amber-500 to-orange-500',
  'Offer': 'from-emerald-500 to-teal-500',
  'Rejected': 'from-rose-500 to-red-500',
};

/**
 * Component: ApplicationModal
 * Detail view and editor for existing job applications.
 * Inherits status colors and formatting from global theme constants.
 */
export function ApplicationModal({
  application,
  isOpen,
  onClose,
}: ApplicationModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Application>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (application) {
      setFormData(application);
    }
  }, [application]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Application>) =>
      updateApplication(application!._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setIsEditing(false);
      toast.success('Updated successfully');
    },
    onError: () => {
      toast.error('Failed to update application');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteApplication(application!._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application removed');
      onClose();
    },
    onError: () => {
      toast.error('Failed to delete');
    },
  });

  if (!application) return null;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Application' : ''}
      size="2xl"
    >
      {!isEditing ? (
        <div className="space-y-8 py-2">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                <div className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${STATUS_GRADIENTS[application.status]} text-[10px] font-bold text-white uppercase tracking-wider shadow-lg shadow-brand-500/10`}>
                  {application.status}
                </div>
                {application.priority && (
                  <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                    application.priority === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    application.priority === 'Low' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  }`}>
                    {application.priority}
                  </div>
                )}
                <ChevronRight className="w-4 h-4 text-surface-300 dark:text-surface-600" />
                <span className="text-xs font-bold text-surface-400 uppercase tracking-widest">{application.seniorityLevel}</span>
              </div>
              
              <div>
                <h2 className="text-3xl font-extrabold text-surface-950 dark:text-white tracking-tight leading-tight">
                  {application.role}
                </h2>
                <div className="flex items-center gap-2 mt-2 group">
                  <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-white/5 flex items-center justify-center text-brand-500">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-lg font-bold text-surface-600 dark:text-surface-400 group-hover:text-brand-500 transition-colors">
                    {application.company}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2.5 rounded-xl border border-surface-200 dark:border-white/10 text-surface-500 hover:text-brand-500 hover:bg-brand-500/10 transition-all"
                title="Edit"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this application?')) {
                    deleteMutation.mutate();
                  }
                }}
                className="p-2.5 rounded-xl border border-surface-200 dark:border-white/10 text-surface-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl border border-surface-200 dark:border-white/10 text-surface-400 hover:text-surface-900 dark:hover:text-white transition-all ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mb-4">
             {application.matchScore > 0 && (
               <div className="flex-1 glass-card p-4 bg-gradient-to-br from-surface-100/50 to-brand-50/30 dark:from-white/[0.03] dark:to-brand-900/10 border-brand-500/10 flex items-center gap-4">
                 <MatchScore score={application.matchScore} size="lg" />
                 <div>
                   <p className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-0.5">Fit Score</p>
                   <p className="text-sm font-medium text-surface-700 dark:text-surface-300">
                     {application.matchScore >= 80 ? 'Strong Match' : application.matchScore >= 60 ? 'Good Match' : 'Weak Match'}
                   </p>
                 </div>
               </div>
             )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 bg-surface-100/30 dark:bg-white/[0.02] border-transparent">
              <MapPin className="w-4 h-4 text-brand-500 mb-2" />
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Location</p>
              <p className="text-sm font-bold text-surface-900 dark:text-surface-100 mt-1">
                {application.locationType === 'Remote' 
                  ? (application.location ? `Remote (${application.location})` : 'Remote')
                  : (application.location ? `${application.location} (${application.locationType})` : application.locationType)
                }
              </p>
            </div>
            <div className="glass-card p-4 bg-surface-100/30 dark:bg-white/[0.02] border-transparent">
              <Calendar className="w-4 h-4 text-brand-500 mb-2" />
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Applied</p>
              <p className="text-sm font-bold text-surface-900 dark:text-surface-100 mt-1">
                {new Date(application.dateApplied).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="glass-card p-4 bg-surface-100/30 dark:bg-white/[0.02] border-transparent">
              <DollarSign className="w-4 h-4 text-brand-500 mb-2" />
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Salary</p>
              <p className="text-sm font-bold text-surface-900 dark:text-surface-100 mt-1">{application.salaryRange || 'N/A'}</p>
            </div>
            <div className="glass-card p-4 bg-surface-100/30 dark:bg-white/[0.02] border-transparent">
              <LinkIcon className="w-4 h-4 text-brand-500 mb-2" />
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Job Link</p>
              {application.jdLink ? (
                <a href={application.jdLink} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1 mt-1">
                  View JD <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <p className="text-sm font-bold text-surface-900 dark:text-surface-100 mt-1">N/A</p>
              )}
            </div>
            <div className="glass-card p-4 bg-surface-100/30 dark:bg-white/[0.02] border-transparent">
              <Briefcase className="w-4 h-4 text-brand-500 mb-2" />
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-wider">Type</p>
              <p className="text-sm font-bold text-surface-900 dark:text-surface-100 mt-1">{application.jobType || 'Full-time'}</p>
            </div>
          </div>

          {/* AI Cover Letter Snippet & Reason */}
          {(application.coverLetterSnippet || application.matchReason) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {application.matchReason && (
                <div className="glass-card p-5 bg-amber-500/5 dark:bg-amber-500/[0.02] border-amber-500/10">
                  <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Why It's a Fit</h4>
                  <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed font-medium">
                    {application.matchReason}
                  </p>
                </div>
              )}
              {application.coverLetterSnippet && (
                <div className="glass-card p-5 bg-brand-500/5 dark:bg-brand-500/[0.02] border-brand-500/10 relative group">
                  <h4 className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-2">Hook Suggestion</h4>
                  <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed font-medium italic">
                    "{application.coverLetterSnippet}"
                  </p>
                  <button
                    onClick={() => handleCopy(application.coverLetterSnippet, -1)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-white dark:bg-surface-900 border border-brand-500/10 shadow-sm opacity-0 group-hover:opacity-100 transition-all text-surface-400 hover:text-brand-500"
                  >
                    {copiedIndex === -1 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold text-surface-500 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              Tailored Resume Points
            </h4>
            <div className="space-y-3">
              {application.resumeBullets.map((bullet, idx) => (
                <div key={idx} className="group relative glass-card p-4 hover:border-brand-500/30 transition-all bg-surface-100/30 dark:bg-white/[0.02]">
                  <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed pr-8">
                    {bullet}
                  </p>
                  <button
                    onClick={() => handleCopy(bullet, idx)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-white dark:bg-surface-900 border border-brand-500/10 shadow-sm opacity-0 group-hover:opacity-100 transition-all text-surface-400 hover:text-brand-500 font-medium"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {application.notes && (
            <div className="space-y-3 pt-4 border-t border-surface-200 dark:border-white/5">
              <h4 className="text-[10px] font-bold text-surface-500 uppercase tracking-widest">Personal Notes</h4>
              <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed whitespace-pre-wrap">
                {application.notes}
              </p>
            </div>
          )}
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate(formData);
          }}
          className="space-y-8"
        >
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Company" value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
              <Input label="Role" value={formData.role || ''} onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-bold text-surface-500 uppercase tracking-widest ml-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
                  className="input-base !py-2.5 !text-sm border-transparent cursor-pointer"
                >
                  <option value="Applied">Applied</option>
                  <option value="Phone Screen">Phone Screen</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-bold text-surface-500 uppercase tracking-widest ml-1">Priority</label>
                <select
                  value={formData.priority || 'Medium'}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'High' | 'Medium' | 'Low' })}
                  className="input-base !py-2.5 !text-sm border-transparent focus:border-brand-500 cursor-pointer"
                >
                  <option value="High">🔴 High Priority</option>
                  <option value="Medium">🟡 Medium Priority</option>
                  <option value="Low">🔵 Low Priority</option>
                </select>
              </div>
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-bold text-surface-500 uppercase tracking-widest ml-1">Job Type</label>
                <select
                  value={formData.jobType}
                  onChange={(e) => setFormData({ ...formData, jobType: e.target.value as JobType })}
                  className="input-base !py-2.5 !text-sm border-transparent cursor-pointer"
                >
                  {JOB_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-1.5 flex flex-col">
                <label className="text-[10px] font-bold text-surface-500 uppercase tracking-widest ml-1">Location Setting</label>
                <select
                  value={formData.locationType}
                  onChange={(e) => setFormData({ ...formData, locationType: e.target.value as LocationType })}
                  className="input-base !py-2.5 !text-sm border-transparent cursor-pointer"
                >
                  {LOCATION_TYPES.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <Input 
                label={formData.locationType === 'Remote' ? "Region/Timezone (Optional)" : "City/Office"}
                value={formData.location || ''} 
                onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                placeholder={formData.locationType === 'Remote' ? "e.g. US Only, UTC-5" : "e.g. Bangalore"}
              />
              <Input label="Salary Range" value={formData.salaryRange || ''} onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })} />
              <Input
                label="Date Applied"
                type="date"
                value={formData.dateApplied ? new Date(formData.dateApplied).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
              />
            </div>

            <Textarea label="Notes" value={formData.notes || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, notes: e.target.value })} rows={4} />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-surface-200 dark:border-white/5">
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={updateMutation.isPending} icon={<Check className="w-4 h-4" />}>
              Save Changes
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
