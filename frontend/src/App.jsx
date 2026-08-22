import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FarmerApp from './components/FarmerApp';
import DiagnosticResults from './components/DiagnosticResults';
import PolicyDashboard from './components/PolicyDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FarmerApp />} />
          <Route path="/diagnose" element={<DiagnosticResults />} />
          <Route path="/dashboard" element={<PolicyDashboard />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
