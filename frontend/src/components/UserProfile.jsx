import React, { useState, useEffect } from 'react';
import { getQueuedScans } from '../lib/sync';
import { Mountain, ChevronRight, CloudDrizzle, CloudOff, User, History, RefreshCw, Pencil, Check } from 'lucide-react';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL || 'https://agrin-pulse-api.onrender.com';

export default function UserProfile() {
  const [offlineScans, setOfflineScans] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Jay Mukati',
    phone: '+91 98765 43210',
    language: 'English'
  });

  const handleSaveProfile = async () => {
    try {
      await axios.put(`${API_BASE}/api/v1/auth/me`, profileData);
    } catch (err) {
      console.warn('Profile update mocked due to lack of DB:', err);
    }
    setIsEditing(false);
  };
  
  useEffect(() => {
    // Check IndexedDB queue
    getQueuedScans().then(scans => {
      setOfflineScans(scans);
    });
  }, []);

  return (
    <div className="shell py-8 animate-in fade-in slide-in-from-bottom-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Farmer Profile</h1>
        <p className="text-white/70">Manage your account, fields, and diagnostic history.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Account Details */}
        <div className="card p-6 col-span-1 md:col-span-1 h-fit relative">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors">
              <Pencil className="w-4 h-4 text-white/70 hover:text-white" />
            </button>
          ) : (
             <button onClick={handleSaveProfile} className="absolute top-6 right-6 p-2 rounded-full bg-green-500/20 hover:bg-green-500/30 transition-colors border border-green-500/50 text-green-400 flex items-center gap-1 px-3">
              <Check className="w-4 h-4" /> <span className="text-xs font-bold">Save</span>
            </button>
          )}
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10 mt-8">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input 
                  type="text" 
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 rounded px-2 py-1 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-green-400 text-white"
                />
              ) : (
                <h2 className="font-bold text-lg">{profileData.name}</h2>
              )}
              <p className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded uppercase tracking-wider inline-block mt-1">Farmer Role</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-white/50 mb-1">Phone Number</p>
              {isEditing ? (
                <input 
                  type="text" 
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 text-white"
                />
              ) : (
                <p className="text-sm">{profileData.phone}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-white/50 mb-1">Preferred Language</p>
              {isEditing ? (
                <select 
                  value={profileData.language}
                  onChange={(e) => setProfileData({...profileData, language: e.target.value})}
                  className="w-full bg-black/40 border border-white/20 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-400 text-white"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Swahili</option>
                  <option>Portuguese</option>
                </select>
              ) : (
                <p className="text-sm">{profileData.language}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-white/50 mb-1">Member Since</p>
              <p className="text-sm">October 2023</p>
            </div>
          </div>
        </div>

        {/* Right Column: Offline Sync & Field Management */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          {/* Offline Sync Status */}
          <div className="card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Offline Sync Status
            </h3>
            {offlineScans.length === 0 ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-950/30 border border-green-500/30">
                <CloudDrizzle className="w-5 h-5" />
                <div>
                  <p className="font-bold text-green-400 text-sm">All Synced</p>
                  <p className="text-xs text-green-400/70">Your local scans have been securely backed up.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-950/30 border border-amber-500/30">
                <CloudOff className="w-5 h-5" />
                <div>
                  <p className="font-bold text-amber-400 text-sm">{offlineScans.length} Scans Pending Network</p>
                  <p className="text-xs text-amber-400/70">These will automatically upload when connectivity is restored.</p>
                </div>
              </div>
            )}
          </div>

          {/* Field Management */}
          <div className="card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Mountain className="w-5 h-5" />
              Registered Plots
            </h3>
            <div className="space-y-3">
              {[
                { name: 'North Wheat Sector', crop: 'Wheat', h3: 'GEO-8860144aa7fffff', area: '2.4 Hectares' },
                { name: 'East Tomato Polyhouse', crop: 'Tomato', h3: 'GEO-8860144aa7ffffe', area: '0.8 Hectares' }
              ].map((plot, i) => (
                <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between hover:bg-white/10 transition-colors cursor-pointer">
                  <div>
                    <h4 className="font-bold text-sm text-green-300">{plot.name}</h4>
                    <p className="text-[11px] text-white/60 mt-1">Crop: {plot.crop} • Area: {plot.area}</p>
                    <p className="text-[10px] text-white/40 mt-0.5 font-mono">H3 ID: {plot.h3}</p>
                  </div>
                  <ChevronRight className="w-5 h-5" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Diagnostic History */}
          <div className="card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <History className="w-5 h-5" />
              Diagnostic History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-xs">
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Crop</th>
                    <th className="pb-3 font-medium">Diagnosis</th>
                    <th className="pb-3 font-medium">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {[
                    { date: 'Today, 08:30 AM', crop: 'Tomato', diagnosis: 'Early Blight', severity: 'Moderate' },
                    { date: 'Yesterday, 14:15 PM', crop: 'Wheat', diagnosis: 'Healthy', severity: 'None' },
                    { date: 'Aug 20, 10:00 AM', crop: 'Tomato', diagnosis: 'Septoria Leaf Spot', severity: 'High' }
                  ].map((scan, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 text-white/80">{scan.date}</td>
                      <td className="py-3">{scan.crop}</td>
                      <td className="py-3 font-medium">{scan.diagnosis}</td>
                      <td className="py-3">
                        <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${
                          scan.severity === 'High' ? 'bg-red-500/20 text-red-300' :
                          scan.severity === 'Moderate' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {scan.severity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
