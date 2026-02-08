import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Templates from './pages/Templates';
import Generator from './pages/Generator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="templates" element={<Templates />} />
          <Route path="generate" element={<Generator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
