import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FarmerApp from './components/FarmerApp';
import DiagnosticResults from './components/DiagnosticResults';
import PolicyDashboard from './components/PolicyDashboard';
import UserProfile from './components/UserProfile';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import NewsHub from './components/NewsHub';
import CommunityForum from './components/CommunityForum';
import CropCalendar from './components/CropCalendar';
import Layout from './components/Layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Only connect WS in browser environment
    if (typeof window !== 'undefined') {
      const wsUrl = import.meta.env.VITE_WS_URL || 'wss://agrin-pulse-api.onrender.com/ws/alerts';
      const socket = new WebSocket(wsUrl);

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setAlerts(prev => [...prev, data]);
          
          // Auto-remove alert after 8 seconds
          setTimeout(() => {
            setAlerts(prev => prev.filter(a => a !== data));
          }, 5000);
        } catch (e) {
          console.error("Invalid WS message:", e);
        }
      };

      return () => {
        socket.close();
      };
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          {/* Global WebSocket Alerts Overlay */}
          <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
            {alerts.map((alert, i) => (
              <div key={i} className={`pointer-events-auto p-4 rounded-xl border backdrop-blur-md shadow-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 ${
                alert.level === 'critical' ? 'bg-red-950/80 border-red-500/50 text-white' :
                alert.level === 'warning' ? 'bg-amber-950/80 border-amber-500/50 text-white' :
                'bg-black/60 border-white/20 text-white'
              }`}>
                {alert.level === 'critical' ? <AlertTriangle className="text-red-400 w-5 h-5 flex-shrink-0" /> : <Info className="text-amber-400 w-5 h-5 flex-shrink-0" />}
                <div>
                  <h4 className="font-bold text-sm">{alert.title}</h4>
                  <p className="text-xs opacity-80 mt-1">{alert.message}</p>
                </div>
                <button 
                  onClick={() => setAlerts(prev => prev.filter(a => a !== alert))}
                  className="ml-auto opacity-50 hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <Routes>
            <Route path="/" element={<FarmerApp />} />
            <Route path="/diagnose" element={<DiagnosticResults />} />
            <Route path="/dashboard" element={<PolicyDashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
                        <Route path="/news" element={<NewsHub />} />
            <Route path="/forum" element={<CommunityForum />} />
            <Route path="/calendar" element={<CropCalendar />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
