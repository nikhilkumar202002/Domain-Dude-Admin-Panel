import React, { useEffect, useState } from 'react';
import { staff as staffService, Staff } from '../../services/Allservices'; 
import { FiTrash2, FiPlus, FiPhone, FiCalendar, FiEdit, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const StaffList = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // A simple gray avatar placeholder (Base64) - Works offline
  const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cbd5e1'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await staffService.getAll(); 
      if (Array.isArray(data)) {
        setStaffList(data);
      } else {
        setStaffList([]); 
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      try {
        await staffService.delete(id);
        setStaffList(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        console.error("Error deleting staff", error);
        alert("Failed to delete staff member");
      }
    }
  };

  const getImageUrl = (path?: string | File) => {
    if (!path || typeof path !== 'string') return PLACEHOLDER_IMAGE;
    let cleanPath = path.replace(/\\/g, '/');
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
    return `http://localhost:5000/${cleanPath}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Staff Team</h1>
        <button 
          onClick={() => navigate('/staff/create')}
          className="flex items-center gap-2 bg-brand-primary px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
        >
          <FiPlus /> Add Member
        </button>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-zinc-950 text-zinc-200 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
            ) : staffList.length > 0 ? (
              staffList.map((person) => (
                <tr key={person.id} className="group hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
                        <img 
                            src={getImageUrl(person.profile_image as string)} 
                            alt={person.first_name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.currentTarget;
                                // Only switch to placeholder if not already there to avoid loop
                                if (target.src !== PLACEHOLDER_IMAGE) {
                                    console.warn("Failed loading:", target.src);
                                    target.src = PLACEHOLDER_IMAGE;
                                }
                            }} 
                        />
                      </div>
                      <div>
                        <div className="font-medium text-white">{person.first_name} {person.last_name}</div>
                        <div className="text-xs">{person.position}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
                      {person.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-2"><FiPhone className="w-3 h-3" /> {person.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-3 h-3" />
                      {new Date(person.joining_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                      <button onClick={() => navigate(`/staff/view/${person.id}`)} className="p-2 hover:bg-blue-500/20 text-blue-500 rounded-lg" title="View">
                        <FiEye />
                      </button>
                      <button onClick={() => navigate(`/staff/edit/${person.id}`)} className="p-2 hover:bg-yellow-500/20 text-yellow-500 rounded-lg" title="Edit">
                        <FiEdit />
                      </button>
                      <button onClick={() => handleDelete(person.id!)} className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg" title="Delete">
                        <FiTrash2 />
                      </button>
                      </div>
                  </td>
                </tr>
              ))
            ) : (
               <tr><td colSpan={5} className="p-4 text-center">No staff found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;