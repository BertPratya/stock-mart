import './App.css'
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from "./pages/auth/global/Topbar";
import Sidebar from './pages/auth/global/Sidebar';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="app">
            <Box sx={{ display: 'flex', height: '100vh' }}>
              {/* Sidebar */}
              <Sidebar />
              
              {/* Main content area */}
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Topbar */}
                <Topbar />
                
                {/* Page content */}
                <Box 
                  component="main" 
                  sx={{ 
                    flexGrow: 1, 
                    p: 3,
                    bgcolor: 'background.default',
                    overflow: 'auto'
                  }}
                >
                  {/* Your page content will go here */}
                </Box>
              </Box>
            </Box>
          </div>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;