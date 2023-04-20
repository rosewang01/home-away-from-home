/* eslint-disable */
import React, { useEffect } from 'react';
import { Box, Typography  } from '@mui/material';

interface CategoryOptionProps {
    label: string;
    icon: any;
    setOption: any;
    selected: string;
}
function CategoryOption({label, icon, setOption, selected} : CategoryOptionProps) {
    return (
        <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: (selected === label) ? 1 : 0.7,
            transition: 'all 0.4s ease',
            ":hover": {
                opacity: 1,
                cursor: 'pointer',
                ".underline": {
                    transform: "scaleY(1)"
                }
            },
        }}
        onClick={() => setOption(label)}
        >
            {icon}
            <Typography
                sx={{
                    color: (selected === label) ? "#3B82F6" : "black",
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
                transform: (selected === label) ? "scaleY(1)" : "scaleY(0)",
            }}
             />
        </Box> 
    )
}

export default CategoryOption