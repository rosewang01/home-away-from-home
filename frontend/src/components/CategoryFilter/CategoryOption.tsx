/* eslint-disable */
import React from 'react';
import { Box, Typography  } from '@mui/material';

interface CategoryOptionProps {
    label: string;
    icon: any;
}
function CategoryOption({label, icon} : CategoryOptionProps) {
    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.7,
            transition: 'all 0.4s ease',
            ":hover": {
                opacity: 1,
                cursor: 'pointer',
                ".underline": {
                    transform: "scaleY(1)"
                }
            },
        }}
        >
            {icon}
            <Typography
                sx={{
                    color: 'black',
                    fontSize: '13px',
                }}
            >
                {label}
            </Typography>
            <Box
            className='underline'
            sx={{
                width: "100%",
                height: "2px",
                background: '#3B82F6',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
                transition: "transform 0.2s ease",
                transform: "scaleY(0)",
            }}
             />
        </Box> 
    )
}

export default CategoryOption