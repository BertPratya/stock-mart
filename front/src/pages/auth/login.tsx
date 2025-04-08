import React, {use, useState} from 'react';
import { Box, Button, TextField,Typography,ThemeProvider,CssBaseline } from '@mui/material';
import {createTheme, useTheme}  from '@mui/material/styles'
import { useFormik } from 'formik';
import {themeSettings, tokens} from '../../theme';
import LoginForm from './loginForm';
import RegisterForm from './registerForm';

const lightTheme = createTheme(themeSettings("light"));

const LoginPage = () => {
    const [isLogin,setIsLogin] = useState(true);

    const theme = lightTheme;
    const colors = tokens(theme.palette.mode);
    const leftSectionFlex = 5;    
    return (
      <>
        <Box display='flex' flexDirection='row' height='100vh' >
            <Box flex={leftSectionFlex} display='flex' justifyContent='center' alignItems='center' bgcolor={colors.primary[400]}>
              {isLogin ? <LoginForm isLogin = {isLogin} setIsLogin={setIsLogin} /> : <RegisterForm isLogin={isLogin} setIsLogin={setIsLogin}/> }
            </Box>

            <Box flex={10-leftSectionFlex} display='flex' justifyContent='center' alignItems='center' bgcolor={colors.grey[100]}>
                
            </Box>
        </Box>
      </>
    );
  };


export default LoginPage;