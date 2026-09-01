import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Complaints from "./pages/Complaints";
import Departments from "./pages/Departments";
import Hotspots from "./pages/Hotspots";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>

      <div className="min-h-screen bg-[#11172b]">

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="lg:pl-[270px]">

          <Navbar
            onMenuClick={() => setSidebarOpen(true)}
          />

          <main className="min-h-[calc(100vh-76px)] bg-[#11172b] p-4 sm:p-6 lg:p-8">

            <Routes>

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/complaints"
                element={<Complaints />}
              />

              <Route
                path="/departments"
                element={<Departments />}
              />

              <Route
                path="/hotspots"
                element={<Hotspots />}
              />

              <Route
                path="/analytics"
                element={<Analytics />}
              />

              <Route
                path="/settings"
                element={<Settings />}
              />

            </Routes>

          </main>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;