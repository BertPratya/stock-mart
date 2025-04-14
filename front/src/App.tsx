import './App.css';
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Topbar from './pages/global/Topbar';
import Sidebar from './pages/global/Sidebar';
import { BrowserRouter as Router } from 'react-router-dom';
import TradingPage from './pages/trading';
import { Provider } from 'react-redux'; // Import the Provider from react-redux
import store from './redux/store';
import UpdateStockPrice from './testFn';
function App() {
  const [theme, colorMode] = useMode();

  return (
    <Provider store={store}> {/* Wrap your app in the Provider */}
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
                      pt: 0, px: 3, pb: 3,
                      bgcolor: 'background.default',
                      overflow: 'hidden'
                    }}
                  >
                    <TradingPage></TradingPage>
                    {/* <TradingPage></TradingPage> */}
                    {/* < */}
                    {/* Your page content will go here */}
                  </Box>
                </Box>
              </Box>
            </div>
          </Router>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </Provider>
  );
}

export default App;
