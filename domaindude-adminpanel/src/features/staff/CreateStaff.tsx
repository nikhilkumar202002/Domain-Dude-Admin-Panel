import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Import the new roles service and interface
import { staff as staffService, roles as roleService, Role } from '../../services/Allservices';
import { FiSave, FiX, FiUpload, FiUser, FiBriefcase, FiLock } from 'react-icons/fi';

const CreateStaff = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [roleList, setRoleList] = useState<Role[]>([]); // State to store roles

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role_id: '',
    first_name: '',
    last_name: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    joining_date: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Fetch Roles on Component Mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await roleService.getAll();
        setRoleList(data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
        alert("Unable to load system roles.");
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'salary' && value === '') {
            data.append(key, '0'); 
        } else {
            data.append(key, value);
        }
      });
      
      if (imageFile) {
        data.append('profile_image', imageFile);
      }

      await staffService.create(data);
      navigate('/staff'); 
    } catch (error: any) {
      console.error("Failed to create staff:", error);
      const msg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || "Error creating staff";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Add New Staff</h1>
            <p className="text-zinc-400 mt-1">Create a user account and staff profile simultaneously.</p>
          </div>
          <button onClick={() => navigate('/staff')} className="p-2 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Account Credentials */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <FiLock className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-white">Account Setup</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                 <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Role</label>
                 <select 
                    name="role_id" 
                    required 
                    onChange={handleChange} 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none appearance-none"
                 >
                    <option value="">Select System Role</option>
                    {/* Dynamic Roles Rendering */}
                    {roleList.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                      </option>
                    ))}
                  </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Username</label>
                <input name="username" type="text" placeholder="jdoe123" required onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Password</label>
                <input name="password" type="password" placeholder="••••••••" required minLength={6} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Section 2: Personal Details */}
            <div className="lg:col-span-2 bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
                  <FiUser className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-white">Personal Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">First Name</label>
                  <input name="first_name" required onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Last Name</label>
                  <input name="last_name" required onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input type="email" name="email" required onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Phone Number</label>
                  <input name="phone" type="tel" required onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" />
                </div>
              </div>
            </div>

            {/* Section 3: Profile Image */}
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm flex flex-col">
               <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                  <FiUpload className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-white">Profile Photo</h2>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-full aspect-square mb-4 bg-zinc-950 border-2 border-dashed border-zinc-700 rounded-xl overflow-hidden hover:border-zinc-500 transition-colors group">
                  <input type="file" id="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" />
                  
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 group-hover:text-zinc-300">
                      <FiUpload className="w-10 h-10 mb-3" />
                      <span className="text-sm">Click to upload</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-zinc-500 text-center">Supported formats: JPG, PNG. <br/> Max size: 5MB.</p>
              </div>
            </div>
          </div>

          {/* Section 4: Job Details */}
          <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                <FiBriefcase className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-white">Job Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Department</label>
                <select name="department" required onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none">
                  <option value="">Select Department</option>
                  <option value="HR">Human Resources</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Position</label>
                <input name="position" placeholder="e.g. Senior Developer" required onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Annual Salary</label>
                <input type="number" name="salary" required onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">Joining Date</label>
                <input type="date" name="joining_date" required onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-4">
            <button 
              type="button"
              onClick={() => navigate('/staff')}
              className="px-6 py-3 rounded-lg text-zinc-400 font-medium hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-white font-bold flex items-center gap-2 shadow-lg shadow-brand-primary/20 transition-all
                ${loading ? 'bg-zinc-700 cursor-not-allowed' : 'bg-brand-primary hover:bg-brand-primary/90 hover:scale-[1.02]'}`}
            >
              <FiSave className="w-5 h-5" /> 
              {loading ? "Processing..." : "Create Staff Profile"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateStaff;