import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { staff as staffService, Staff } from '../../services/Allservices';
import { FiArrowLeft, FiEdit, FiUser, FiMail, FiPhone, FiBriefcase, FiCalendar, FiDollarSign, FiShield } from 'react-icons/fi';

const ViewStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);

  // CHANGE THIS to your actual backend URL
  const API_BASE_URL = "http://localhost:5000"; 

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        if (!id) return;
        const data = await staffService.getById(id);
        setStaff(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
        alert("Failed to load staff details");
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [id]);

  if (loading) return <div className="text-white p-10 text-center">Loading Profile...</div>;
  if (!staff) return <div className="text-white p-10 text-center">Staff member not found.</div>;

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-4xl">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate('/staff')} 
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <FiArrowLeft /> Back to List
          </button>
          <button 
            onClick={() => navigate(`/staff/edit/${staff.id}`)} // Assuming you have an edit route
            className="bg-brand-primary px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:opacity-90"
          >
            <FiEdit /> Edit Profile
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 mb-6 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Image */}
          <div className="w-32 h-32 rounded-full border-4 border-zinc-800 overflow-hidden shrink-0">
             <img 
               src={staff.profile_image ? `${API_BASE_URL}/${staff.profile_image}` : "https://via.placeholder.com/150"} 
               alt={`${staff.first_name} ${staff.last_name}`}
               className="w-full h-full object-cover"
             />
          </div>
          
          {/* Main Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">{staff.first_name} {staff.last_name}</h1>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
               <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                 {staff.position}
               </span>
               <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium border border-purple-500/20">
                 {staff.department}
               </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Personal Information */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-6 border-b border-zinc-800 pb-2">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-500">
                  <FiMail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Email Address</p>
                  <p className="text-white">{staff.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-500">
                  <FiPhone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Phone Number</p>
                  <p className="text-white">{staff.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-zinc-300">
                 <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-500">
                  <FiUser className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Username</p>
                  <p className="text-white">{staff.username}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-6 border-b border-zinc-800 pb-2">Employment Details</h2>
            <div className="space-y-4">
               <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-500">
                  <FiShield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">System Role</p>
                  <p className="text-white capitalize">{staff.role_name || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-500">
                  <FiDollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Salary</p>
                  <p className="text-white">${Number(staff.salary).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-500">
                  <FiCalendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase">Joining Date</p>
                  <p className="text-white">{new Date(staff.joining_date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewStaff;