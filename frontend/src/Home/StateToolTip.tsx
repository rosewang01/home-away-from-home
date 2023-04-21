/* eslint-disable */
import React, { useEffect } from 'react';
import { Box, Typography, Chip, Stack} from '@mui/material';
import GradeIcon from '@mui/icons-material/Grade';
import PaidIcon from '@mui/icons-material/Paid';
import WorkIcon from '@mui/icons-material/Work';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

interface StateToolTipProps {
    hoverInfo: any,
}
function StateToolTip({hoverInfo} : StateToolTipProps) {
    return (
        <Box 
            sx={{
                position: 'absolute',
                left: hoverInfo.x,
                top: hoverInfo.y + 8,
                background: 'white',
                border: '1px solid #3B82F6',
                p: '12px 20px',
                borderRadius: '10px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
            }}
        >
            <Typography
            sx={{
                fontSize: '18px',
                
            }}
            >{hoverInfo.feature.properties.name}</Typography>
            <Box sx={{ m: 0.5 }} />
            <Stack
                direction='row'
                spacing={1}
            >
                <Chip 
                label={"Score: " + hoverInfo.feature.properties.score}
                variant='outlined'
                sx={{
                    border: '1px solid #3B82F6',
                }}
                size="small"
                icon={<GradeIcon sx={{ color: '#3B82F6 !important' }} />}
                />
                <Chip 
                    label={"Cost: " + hoverInfo.feature.properties.cost + "k"}
                    variant='outlined'
                    sx={{
                        border: '1px solid #3B82F6',
                    }}
                    size="small"
                    icon={<PaidIcon sx={{ color: '#3B82F6 !important' }} />}
                />
            </Stack>
            <Box sx={{ m: 1 }} />
            <Stack
                direction='row'
                spacing={1}
            >
                <Chip 
                    label={"Wage: " + hoverInfo.feature.properties.salary + "k"}
                    variant='outlined'
                    sx={{
                        border: '1px solid #3B82F6',
                    }}
                    size="small"
                    icon={<WorkIcon sx={{ color: '#3B82F6 !important' }} />}
                />
                <Chip 
                    label={"Growth: " + hoverInfo.feature.properties.growth + "%"}
                    variant='outlined'
                    sx={{
                        border: '1px solid #3B82F6',
                    }}
                    size="small"
                    icon={<AutoGraphIcon sx={{ color: '#3B82F6 !important' }} />}
                />
            </Stack>
        </Box>
    )
}

export default StateToolTip;