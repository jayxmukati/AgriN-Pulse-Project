import React from 'react';
import { Sprout, Sun, Calendar as CalendarIcon, CheckCircle2, ChevronRight, Droplets, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function CropCalendar() {
  const navigate = useNavigate();

  const timeline = [
    { stage: 'Sowing', date: 'Oct 15', status: 'completed', icon: <Sprout className="w-5 h-5" /> },
    { stage: 'Vegetative', date: 'Nov - Dec', status: 'active', icon: <Sun className="w-5 h-5" /> },
    { stage: 'Flowering', date: 'Jan - Feb', status: 'pending', icon: <CalendarIcon className="w-5 h-5" /> },
    { stage: 'Harvesting', date: 'Mar - Apr', status: 'pending', icon: <Droplets className="w-5 h-5" /> },
  ];

  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    axios.get(`${API_BASE}/api/v1/calendar`)
      .then(res => setTasks(res.data))
      .catch(err => console.error("Failed to fetch calendar tasks", err));
  }, []);

  return (
    <div className="w-full relative z-10 text-white font-body-md pb-24 animate-in fade-in">
      <main className="flex flex-col gap-5 mt-4">
        <header className="mb-2">
          <h1 className="text-3xl font-bold mb-2">Crop Lifecycle</h1>
          <p className="text-white/70">Manage tasks and track growth stages.</p>
        </header>

        {/* Timeline */}
        <section className="card p-6 border-l-4 border-l-green-400">
          <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-green-400" />
            Winter Wheat (Plot A)
          </h2>
          
          <div className="relative pl-6 border-l-2 border-white/10 space-y-8">
            {timeline.map((item, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-[35px] w-8 h-8 rounded-full border-4 border-[#0b1310] flex items-center justify-center
                  ${item.status === 'completed' ? 'bg-green-500 text-black' : 
                    item.status === 'active' ? 'bg-amber-500 animate-pulse text-black' : 
                    'bg-white/10 text-white/40'}`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className={`font-bold text-base ${item.status === 'active' ? 'text-amber-400' : item.status === 'completed' ? 'text-green-400' : 'text-white/60'}`}>
                    {item.stage}
                  </h3>
                  <p className="text-xs text-white/50">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Tasks */}
        <section className="card p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Upcoming Tasks
          </h2>
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <div key={i} className="glass-panel p-4 flex items-center justify-between border border-white/10 hover:border-white/20 transition-colors cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${task.priority === 'High' ? 'bg-red-400 animate-pulse' : task.priority === 'Medium' ? 'bg-amber-400' : 'bg-green-400'}`}></div>
                  <div>
                    <h3 className="font-bold text-sm text-white group-hover:text-green-300 transition-colors">{task.title}</h3>
                    <p className="text-xs text-white/60 mt-0.5">{task.type} • Due: {task.due}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
