/* eslint-disable */
import React from 'react';
import { Box, Typography } from '@mui/material';

interface DataDrawerCardProps {
  label: any;
  icon: any;
  content: any;
}
function DataDrawerCard({ icon, label, content }: DataDrawerCardProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #3B82F6',
        borderRadius: '10px',
        width: 'fit-content',
        boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
        p: '10px 15px',
        color: '#3B82F6',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {icon}
        <Box sx={{ m: 0.5 }} />
        <Typography
          sx={{
            fontSize: '14px',
            color: 'black',
            fontWeight: '400',
          }}
        >
          {label}
        </Typography>
      </Box>
      <Box sx={{ m: 0.5 }} />
      <Typography
        sx={{
          color: 'black',
          fontWeight: '500',
          fontSize: '20px',
        }}
      >
        {content}
      </Typography>
      <Box sx={{ m: 0.5 }} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: '12px',
            color: 'grey',
          }}
        >
          Over 8 million records
        </Typography>
      </Box>
    </Box>
  );
}

export default DataDrawerCard;
