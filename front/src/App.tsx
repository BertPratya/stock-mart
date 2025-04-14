import './App.css';
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from './pages/global/Topbar';
import Sidebar from './pages/global/Sidebar';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import TradingPage from './pages/trading';
import { Provider } from 'react-redux';
import store from './redux/store';
import LoginPage from './pages/auth/login';

// Auth check component
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

function App() {
  const [theme, colorMode] = useMode();

  return (
    <Provider store={store}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes>
              {/* Login route - no sidebar/topbar */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected routes with layout */}
              <Route path="/" element={
                <RequireAuth>
                  <div className="app">
                    <Box sx={{ display: 'flex', height: '100vh' }}>
                      <Sidebar />
                      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Topbar />
                        <Box 
                          component="main" 
                          sx={{ 
                            flexGrow: 1,
                            pt: 0, px: 3, pb: 3,
                            bgcolor: 'background.default',
                            overflow: 'hidden'
                          }}
                        >
                          <TradingPage />
                        </Box>
                      </Box>
                    </Box>
                  </div>
                </RequireAuth>
              } />
              
              {/* Trading route - just an alias for root */}
              <Route path="/trading" element={<Navigate to="/" replace />} />
              
              {/* Catch all unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Provider>
  );
}

export default App;