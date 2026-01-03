import React, { useEffect, useState } from 'react';
import { staffAPI, Staff } from '../../services/Allservices'; // Adjust path if needed
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiPhone, FiCalendar } from 'react-icons/fi';

const StaffList = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Staff on Mount
  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const data = await staffAPI.getAll();
      setStaff(data);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      try {
        await staffAPI.delete(id);
        // Optimistic update: remove from UI immediately
        setStaff(prev => prev.filter(item => item.id !== id));
      } catch (error) {
        alert('Failed to delete staff member');
      }
    }
  };

  // Filter staff based on search
  const filteredStaff = staff.filter(person => 
    person.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center text-zinc-500">Loading staff data...</div>;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Staff Management</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your team members and their roles.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm">
          <FiPlus className="w-4 h-4" />
          Add New Staff
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center bg-zinc-900/50 p-2 rounded-xl border border-zinc-800 w-full md:w-96">
        <FiSearch className="text-zinc-400 ml-2 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search by name or position..." 
          className="bg-transparent border-none focus:ring-0 text-white w-full ml-2 text-sm placeholder-zinc-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Staff Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/30">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-zinc-900 text-xs uppercase font-semibold text-zinc-300">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Role & Dept</th>
              <th className="px-6 py-4">Salary</th>
              <th className="px-6 py-4">Joined Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((person) => (
                <tr key={person.id} className="hover:bg-zinc-800/50 transition-colors group">
                  
                  {/* Employee Name & Image */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
                        {person.profile_image ? (
                          // Adjust the base URL if your images are stored relatively
                          <img 
                            src={`http://localhost:5000/${person.profile_image}`} 
                            alt={person.first_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-zinc-500">
                            {person.first_name[0]}{person.last_name[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {person.first_name} {person.last_name}
                        </div>
                        <div className="text-xs text-zinc-500">ID: {person.user_id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <FiPhone className="w-3 h-3" /> {person.phone}
                      </div>
                    </div>
                  </td>

                  {/* Role & Dept */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{person.position}</div>
                    <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-primary/10 text-brand-secondary mt-1">
                      {person.department}
                    </div>
                  </td>

                  {/* Salary */}
                  <td className="px-6 py-4 font-mono text-zinc-300">
                    ${Number(person.salary).toLocaleString()}
                  </td>

                  {/* Joining Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-3 h-3" />
                      {new Date(person.joining_date).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-brand-primary/20 text-brand-secondary rounded-lg transition-colors" title="Edit">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(person.id)}
                        className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors" 
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                  No staff members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffList;