import './styles/App.css';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import Login from './pages/login/Login';
import Navbar from './components/layout/Navbar';
import PagePlaceholder from './components/common/page-placeholder/PagePlaceholder';
import { pages } from './utils/config/pages.config';
import Home from './pages/home/Home';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();
  const showNavbar: boolean = location.pathname !== '/login';
  
  return (
    <div className="App">
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {pages.map((p) => {
          const Element = p.element;
          return (
            <Route
              key={p.id}
              path={p.path}
              element={
                  Element ? (
                    <Element />
                  ) : (
                    <PagePlaceholder
                      title={p.label}
                      note={`id: ${p.id} · path: ${p.path}`}
                    />
                  )
                }
              />
            );
          })}

        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        rtl
        theme="colored"
        toastStyle={{
          fontSize: '13px',
          borderRadius: '8px',
          boxShadow: 'none',
        }}
      />
      
    </div>
  );
}

export default App;
