import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import { Box } from '@mui/material';

const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar /> 
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f4f6f8' }}>
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default AdminLayout;