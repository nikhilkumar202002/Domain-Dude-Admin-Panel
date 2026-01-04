import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects as projectService, Project } from '../../services/Allservices';
import { SERVER_URL } from '../../services/axios'; // <--- IMPORT COMMON URL
import { FiPlus, FiExternalLink, FiCalendar, FiLayers, FiImage, FiSearch } from 'react-icons/fi';

const ProjectList = () => {
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjectList(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get the featured image URL using the common SERVER_URL
  const getFeaturedImage = (project: Project) => {
    if (!project.images || project.images.length === 0) return null;
    
    // Find the image marked as featured, or fallback to the first one
    const featured = project.images.find(img => img.featured === 1 || img.featured === true) || project.images[0];
    
    // Use SERVER_URL here
    return featured && featured.path ? `${SERVER_URL}/${featured.path}` : null;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Present";
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 p-8 flex items-center justify-center text-zinc-500">
      Loading Projects...
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Project Management</h1>
            <p className="text-zinc-400 mt-1">View and manage your portfolio entries.</p>
          </div>
          <button 
            onClick={() => navigate('/projects/create')} 
            className="bg-brand-primary hover:bg-brand-primary/90 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg shadow-brand-primary/20"
          >
            <FiPlus className="w-5 h-5" /> Add Project
          </button>
        </div>

        {/* Empty State */}
        {!loading && projectList.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-800">
            <div className="bg-zinc-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-500">
              <FiLayers className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-white">No projects found</h3>
            <p className="text-zinc-500 mt-2 max-w-sm mx-auto">
              Get started by adding your first project to showcase your work.
            </p>
          </div>
        ) : (
          /* Table Container */
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950/50 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                    <th className="px-6 py-4 font-semibold">Project Details</th>
                    <th className="px-6 py-4 font-semibold">Timeline</th>
                    <th className="px-6 py-4 font-semibold">Tech Stack</th>
                    <th className="px-6 py-4 font-semibold text-right">Links</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {projectList.map((project) => {
                    const imageUrl = getFeaturedImage(project);

                    return (
                      <tr key={project.id} className="group hover:bg-zinc-800/30 transition-colors">
                        
                        {/* Column 1: Image & Title */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-12 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
                              {imageUrl ? (
                                <img src={imageUrl} alt={project.title} className="w-full h-full object-cover" />
                              ) : (
                                <FiImage className="text-zinc-700 w-5 h-5" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-white text-base">{project.title}</div>
                              <div className="text-sm text-zinc-500 line-clamp-1 max-w-xs">{project.description}</div>
                            </div>
                          </div>
                        </td>

                        {/* Column 2: Timeline */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-950/50 px-3 py-1.5 rounded-md w-fit border border-zinc-800/50">
                            <FiCalendar className="w-4 h-4 text-zinc-500" />
                            <span>{formatDate(project.start_date)} — {formatDate(project.end_date)}</span>
                          </div>
                        </td>

                        {/* Column 3: Tech Stack */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2 max-w-xs">
                            {project.technology.split(',').slice(0, 3).map((tech, i) => (
                              <span key={i} className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs rounded border border-zinc-700">
                                {tech.trim()}
                              </span>
                            ))}
                            {project.technology.split(',').length > 3 && (
                              <span className="px-2 py-1 text-zinc-500 text-xs">+{project.technology.split(',').length - 3}</span>
                            )}
                          </div>
                        </td>

                        {/* Column 4: Links / Actions */}
                        <td className="px-6 py-4 text-right">
                          {project.website_link ? (
                            <a 
                              href={project.website_link} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-white transition-colors"
                            >
                              Visit Site <FiExternalLink />
                            </a>
                          ) : (
                            <span className="text-zinc-600 text-sm italic">No link</span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;