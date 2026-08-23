import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Map, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CROP_COLORS = ['#4ade80', '#22c55e', '#16a34a', '#15803d'];

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  
  // Mock time-series data for predictive risk
  const riskData = [
    { name: 'Week 1', risk: 20 },
    { name: 'Week 2', risk: 35 },
    { name: 'Week 3', risk: 25 },
    { name: 'Week 4', risk: 60 },
    { name: 'Week 5', risk: 45 },
    { name: 'Week 6', risk: 80 },
  ];

  const cropData = [
    { name: 'Wheat', value: 45 },
    { name: 'Tomato', value: 30 },
    { name: 'Soybean', value: 15 },
    { name: 'Maize', value: 10 },
  ];

  useEffect(() => {
    axios.get(`${API_BASE}/api/v1/analytics`)
      .then(res => setData(res.data))
      .catch(err => console.error("Failed to load analytics:", err));
  }, []);

  return (
    <div className="shell py-8 animate-in fade-in slide-in-from-bottom-4">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Macro-Analytics</h1>
          <p className="text-white/70">Regional intelligence & policy dashboard.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/50 mb-1">Active Region</p>
          <div className="bg-white/10 px-3 py-1 rounded-lg text-sm font-bold border border-white/20">
            {data?.node_info?.region || 'Loading...'}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* KPI Cards */}
        {[
          { label: 'Registered Area (Ha)', value: data?.kpis?.total_registered_area_ha?.toLocaleString() || '-', icon: 'landscape', color: 'text-green-400' },
          { label: 'Disease Alerts', value: data?.kpis?.active_disease_alerts || '-', icon: 'warning', color: 'text-red-400' },
          { label: 'Avg Regional NDVI (Real-Time Telemetry)', value: data?.kpis?.avg_regional_ndvi || '-', icon: 'satellite_alt', color: 'text-blue-400' },
          { label: 'Climate Adaptation Index', value: data?.kpis?.climate_adaptation_index || '-', icon: 'eco', color: 'text-green-400' }
        ].map((kpi, i) => (
          <div key={i} className="card p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <span className={`material-symbols-outlined ${kpi.color}`}>{kpi.icon}</span>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">{kpi.value}</p>
              <p className="text-xs text-white/60">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Predictive Risk Chart */}
        <div className="card p-6 md:col-span-2">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Predictive Outbreak Risk <span className="ml-3 text-[10px] bg-white/10 text-white px-2 py-0.5 rounded border border-white/20">Simulated ML Projections</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="risk" stroke="#f87171" fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Distribution Pie */}
        <div className="card p-6">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Crop Distribution
          </h3>
          <div className="h-64 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {cropData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CROP_COLORS[index % CROP_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">1.2M</span>
              <span className="text-[10px] text-white/50 uppercase">Total Ha</span>
            </div>
          </div>
        </div>

        {/* H3 Heatmap Mock Representation */}
        <div className="card p-6 md:col-span-3">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <Map className="w-5 h-5" />
            H3 Spatial Hotspot Grid <span className="ml-3 text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded border border-green-500/30">Real-Time Telemetry</span>
          </h3>
          <p className="text-sm text-white/60 mb-6">Aggregated pathological scans anonymized to H3 Hex Geo-IDs.</p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {Array.from({ length: 32 }).map((_, i) => {
              // Generate some random intensity for the mock heatmap
              const intensity = Math.random();
              let bgColor = 'bg-white/5 border-white/10';
              if (intensity > 0.8) bgColor = 'bg-red-500/40 border-red-500/50';
              else if (intensity > 0.5) bgColor = 'bg-amber-500/30 border-amber-500/40';
              else if (intensity > 0.2) bgColor = 'bg-green-500/20 border-green-500/30';
              
              return (
                <div key={i} className={`h-16 rounded-lg border flex items-center justify-center backdrop-blur-sm ${bgColor} hover:scale-105 transition-transform cursor-pointer`}>
                  <span className="text-[8px] font-mono opacity-40">GEO-{i.toString(16).padStart(3, '0')}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Raw Regional Crop Yields Data Table */}
        <div className="card p-6 md:col-span-3 mt-6">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Raw Regional Crop Yields <span className="ml-3 text-[10px] bg-white/10 text-white px-2 py-0.5 rounded border border-white/20">Simulated ML Projections</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-xs">
                  <th className="pb-3 font-medium px-4">Geo-ID (H3)</th>
                  <th className="pb-3 font-medium px-4">Primary Crop</th>
                  <th className="pb-3 font-medium px-4">Projected Yield (Tons/Ha)</th>
                  <th className="pb-3 font-medium px-4">Variance (YOY)</th>
                  <th className="pb-3 font-medium px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  { geo: 'GEO-8860144aa7fffff', crop: 'Wheat', yield: '4.2', variance: '+1.5%', status: 'Optimal' },
                  { geo: 'GEO-8860144aa7ffffe', crop: 'Tomato', yield: '65.0', variance: '-2.1%', status: 'Heat Stress' },
                  { geo: 'GEO-8860144aa7ffffd', crop: 'Soybean', yield: '2.8', variance: '+0.4%', status: 'Normal' },
                  { geo: 'GEO-8860144aa7ffffc', crop: 'Maize', yield: '8.5', variance: '+5.2%', status: 'Optimal' },
                  { geo: 'GEO-8860144aa7ffffb', crop: 'Wheat', yield: '3.9', variance: '-4.8%', status: 'Blight Risk' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-white/80">{row.geo}</td>
                    <td className="py-3 px-4 font-bold">{row.crop}</td>
                    <td className="py-3 px-4 text-green-300 font-mono">{row.yield}</td>
                    <td className={`py-3 px-4 font-bold ${row.variance.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>{row.variance}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${
                        row.status === 'Optimal' || row.status === 'Normal' ? 'bg-green-500/20 text-green-300' :
                        row.status === 'Heat Stress' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {row.status}
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
  );
}
