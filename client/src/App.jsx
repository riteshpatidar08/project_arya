import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Homepage from './pages/Homepage';
import ProtectedRoutes from './component/ProtectedRoutes';
import OpenRoutes from './component/OpenRoutes';
import Navbar from './component/Navbar';
import CreateEventPage from './pages/CreateEventPage';
import Footer from './component/Footer';
import EventDetailPage from './pages/EventDetailPage';
function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route element={<OpenRoutes />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            <Route path="/" element={<Homepage />} />
 <Route path='/event/:id' element={<EventDetailPage/>}/>
            {/* accessible when i have token */}
            <Route element={<ProtectedRoutes />}>
              <Route path="/createevent" element={<CreateEventPage />} />
              {/* outlet is the child routes  */}
            </Route>
          </Routes>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
