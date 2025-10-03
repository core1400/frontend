import './styles/App.css';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';

import Login from './pages/login/Login';
import Navbar from './components/layout/Navbar';
import PagePlaceholder from './components/common/page-placeholder/PagePlaceholder';
import { pages } from './utils/config/pages.config';

//home page placeholder:
function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>בית</h1>
      <p>ברוך הבא 👋</p>
    </div>
  );
}

function App() {
  const location = useLocation();
  const showNavbar: boolean = location.pathname !== '/login';
  

  return (
    <div className="App">
      {showNavbar && <Navbar />}

      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* As of branch feature/routes using placeholders for pages */}
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
    </div>
  );
}

export default App;
