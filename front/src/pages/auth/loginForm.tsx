import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createTheme } from '@mui/material/styles';
import { themeSettings, tokens } from '../../theme';
import { loginUser, registerUser } from '../../services/accountService';

const lightTheme = createTheme(themeSettings("light"));

interface LoginFormProps {
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
    isLogin: boolean;
  }
  

  const LoginForm = ({ setIsLogin, isLogin }: LoginFormProps) => {
  const theme = lightTheme;
  const colors = tokens(theme.palette.mode);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
    }),
    onSubmit: async (values) => {
      try{
            const data = await loginUser(values.email,values.password)
            
      }catch(err:any){
            if(err.response?.status === 401){
                formik.setErrors({email:"Invalid email or password",password:"Invalid email or password"})
            }else{
                console.error('Unexpected error:', err);
                alert('Something went wrong. Please try again later.');
            }
      }
    },
  });
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    formik.handleSubmit();
  };

  const showError = (fieldName: keyof typeof formik.values) => {
      return formSubmitted && Boolean(formik.errors[fieldName]);
  };

  const getErrorMessage = (fieldName: keyof typeof formik.values) => {
      return formSubmitted ? formik.errors[fieldName] : '';
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      maxWidth="400px"
      bgcolor={colors.primary[400]}
      padding={3}
      borderRadius={2}
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      
      <TextField
        fullWidth
        margin="normal"
        id="email"
        name="email"
        label="Email"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={showError('email')} 
        helperText={getErrorMessage('email')}
        sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: colors.grey[300], 
              },
              '&:hover fieldset': {
                borderColor: colors.grey[200], 
              },
              '&.Mui-focused fieldset': {
                borderColor: colors.blueAccent[400],
              },
            },
            '& .MuiInputBase-input': {
              color: colors.primary[500],
            },
            '& .MuiInputLabel-root': { 
              color: colors.primary[300], 
            }
            
          }}
        />
      
      <TextField
        fullWidth
        margin="normal"
        id="password"
        name="password"
        label="Password"
        type="password"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={showError('password')}
        helperText={getErrorMessage('password')}
        sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: colors.grey[300], 
              },
              '&:hover fieldset': {
                borderColor: colors.grey[200],
              },
              '&.Mui-focused fieldset': {
                borderColor: colors.blueAccent[400], 
              },
            },
            '& .MuiInputBase-input': {
              color: colors.primary[500], 
            },
            '& .MuiInputLabel-root': { 
              color: colors.primary[300], 
            }
            
          }}
        />
      
      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        fullWidth
        sx={{ mt: 2 }}
      >
        Login
      </Button>

      <Typography sx={{ marginTop: '16px' }}>
  Don't have an account yet?{' '}
<span 
    style={{ 
        color: 'blue',   
        fontWeight: 'bold',  
        cursor: 'pointer' 
    }} 
    onMouseEnter={(e) => (e.target as HTMLElement).style.textDecoration = 'underline'} 
    onMouseLeave={(e) => (e.target as HTMLElement).style.textDecoration = 'none'}
    onClick={() => setIsLogin(false)}
>
    Sign up for free.
</span>
</Typography>

    </Box>
  );
};

export default LoginForm;