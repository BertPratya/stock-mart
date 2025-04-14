import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createTheme } from '@mui/material/styles';
import { themeSettings, tokens } from '../../theme';
import { registerUser } from '../../services/accountService';
import { useNavigate } from 'react-router-dom';
const lightTheme = createTheme(themeSettings("light"));

interface RegisterFormProps {
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
  isLogin: boolean;
}

const RegisterForm = ({ setIsLogin, isLogin }: RegisterFormProps) => {
  const theme = lightTheme;
  const colors = tokens(theme.palette.mode);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
        try {
          const data = await registerUser(values.email, values.password);
          localStorage.setItem('token', data.token);
            
          // Also store user info if needed
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('userName', data.userName);
          localStorage.setItem('userEmail', data.email);
          navigate('/');

        } catch (err: any) {
          if (err.response?.status === 409) {
            formik.setErrors({ email: 'User already exists' });
          } else {
            console.error('Unexpected error:', err);
            alert('Something went wrong. Please try again later.');
          }
        }
      }
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    formik.handleSubmit();
  };

  // Only show errors after form submission attempt
  const showError = (fieldName: keyof typeof formik.values) => {
      return formSubmitted && Boolean(formik.errors[fieldName]);
  };

  // Get error message if should be shown
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
        Register
      </Typography>
      
      {/* Email Input Field */}
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
      
      {/* Password Input Field */}
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
      
      {/* Confirm Password Input Field */}
      <TextField
        fullWidth
        margin="normal"
        id="confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        error={showError('confirmPassword')}
        helperText={getErrorMessage('confirmPassword')}
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
        Register
      </Button>

      <Typography sx={{ marginTop: '16px' }}>
        Already have an account?{' '}
        <span 
          style={{ 
            color: 'blue',
            fontWeight: 'bold',
            cursor: 'pointer' 
          }} 
          onMouseEnter={(e) => (e.target as HTMLElement).style.textDecoration = 'underline'} 
          onMouseLeave={(e) => (e.target as HTMLElement).style.textDecoration = 'none'}
          onClick={() => setIsLogin(true)}
        >
          Login here
        </span>
      </Typography>
    </Box>
  );
};

export default RegisterForm;