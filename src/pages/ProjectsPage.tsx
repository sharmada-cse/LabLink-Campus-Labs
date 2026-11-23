import DashboardLayout from '../components/DashboardLayout';
import { useApp } from '../context/AppContext';
import { projects } from '../data/mockData';
import { equipment } from '../data/mockData';
import { Plus, Calendar, Layers, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export default function ProjectsPage() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const myProjects = projects.filter(p => p.studentId === currentUser.id);

  const getEquipmentNames = (ids: string[]) =>
    ids.map(id => equipment.find(e => e.id === id)?.name || id);

  return (
    <DashboardLayout title="My Projects" subtitle="Track your research and development projects">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">{myProjects.length} Active Projects</h3>
        <button onClick={() => navigate('/booking')}
          className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
          <Plus size={16} /> New Project
        </button>
      </div>

      {myProjects.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Layers size={40} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-gray-500 text-sm">Start by creating a booking for your first project.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {myProjects.map(project => (
            <div key={project.id} className="glass rounded-2xl p-6 hover:border-cyan-500/20 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`badge text-xs mb-2 inline-flex ${
                    project.status === 'active' ? 'status-available' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {project.status}
                  </span>
                  <h3 className="font-bold text-white text-base leading-snug">{project.title}</h3>
                </div>
                <ChevronRight size={18} className="text-gray-600 group-hover:text-cyan-400 transition-colors shrink-0 mt-1" />
              </div>

              <p className="text-sm text-gray-400 mb-4 leading-relaxed line-clamp-2">{project.description}</p>

              <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-cyan-400" />
                  Deadline: <span className="text-amber-400 font-medium">{format(new Date(project.deadline), 'MMM d, yyyy')}</span>
                </span>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Required Equipment</p>
                <div className="flex flex-wrap gap-1.5">
                  {getEquipmentNames(project.requiredEquipment).map(name => (
                    <span key={name} className="text-xs glass px-2.5 py-1 rounded-full border border-white/10 text-gray-300">
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/8 flex gap-2">
                <button onClick={() => navigate('/booking')}
                  className="flex-1 text-xs text-center py-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all">
                  Book Equipment
                </button>
                <button onClick={() => navigate('/smartlab')}
                  className="flex-1 text-xs text-center py-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-all">
                  AI Recommend
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
