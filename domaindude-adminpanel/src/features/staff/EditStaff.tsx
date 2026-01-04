import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { staff as staffService, Staff } from '../../services/Allservices';
import { FiSave, FiX } from 'react-icons/fi';

const EditStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Staff>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (id) {
      staffService.getById(id)
        .then(data => {
          // Format date for input field yyyy-MM-dd
          if (data.joining_date) {
            data.joining_date = new Date(data.joining_date).toISOString().split('T')[0];
          }
          setFormData(data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        // Don't append the old image URL string, only new files or text data
        if (key !== 'profile_image' && value !== undefined && value !== null) {
            data.append(key, value.toString());
        }
      });
      if (imageFile) {
        data.append('profile_image', imageFile);
      }

      await staffService.update(id!, data);
      navigate('/staff');
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Edit Staff</h1>
        <button onClick={() => navigate('/staff')} className="text-zinc-400 hover:text-white"><FiX size={24}/></button>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4">
         {/* Reusing structure from Create Form - Add inputs here similar to CreateStaff but with value={formData.field || ''} */}
         <div className="grid grid-cols-2 gap-4">
            <input name="first_name" value={formData.first_name || ''} onChange={handleChange} placeholder="First Name" className="bg-zinc-950 text-white p-2 rounded border border-zinc-800"/>
            <input name="last_name" value={formData.last_name || ''} onChange={handleChange} placeholder="Last Name" className="bg-zinc-950 text-white p-2 rounded border border-zinc-800"/>
         </div>
         <input name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email" className="w-full bg-zinc-950 text-white p-2 rounded border border-zinc-800"/>
         <input name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="Phone" className="w-full bg-zinc-950 text-white p-2 rounded border border-zinc-800"/>
         <div className="grid grid-cols-2 gap-4">
             <input name="department" value={formData.department || ''} onChange={handleChange} placeholder="Department" className="bg-zinc-950 text-white p-2 rounded border border-zinc-800"/>
             <input name="position" value={formData.position || ''} onChange={handleChange} placeholder="Position" className="bg-zinc-950 text-white p-2 rounded border border-zinc-800"/>
         </div>
         <div className="grid grid-cols-2 gap-4">
            <input type="number" name="salary" value={formData.salary || ''} onChange={handleChange} placeholder="Salary" className="bg-zinc-950 text-white p-2 rounded border border-zinc-800"/>
            <input type="date" name="joining_date" value={formData.joining_date || ''} onChange={handleChange} className="bg-zinc-950 text-white p-2 rounded border border-zinc-800"/>
         </div>
         
         <div>
            <p className="text-sm text-zinc-400 mb-2">Change Profile Image (Optional)</p>
            <input type="file" onChange={handleFileChange} className="text-white"/>
         </div>

         <button type="submit" disabled={saving} className="w-full bg-brand-primary p-3 rounded font-bold">{saving ? "Updating..." : "Update Staff"}</button>
      </form>
    </div>
  );
};
export default EditStaff;