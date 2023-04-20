/* eslint-disable */
import React from 'react';
import Map from 'react-map-gl';
import { Box, AppBar, Container, Typography, Toolbar, Paper, InputBase, IconButton, Button, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import {ReactComponent as SiteLogo} from '../assets/homeawayfromhome.svg';
import LandscapeIcon from '@mui/icons-material/Landscape';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BadgeIcon from '@mui/icons-material/Badge';
import PaidIcon from '@mui/icons-material/Paid';
import WorkIcon from '@mui/icons-material/Work';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import CategoryOption from '../components/CategoryFilter/CategoryOption';

function HomePage() {
    return (
        <Box>
            <AppBar 
                sx={{
                    background: 'white',
                    boxShadow: 'none',
                }}
                position='fixed'>
                <Container
                    sx={{
                        background: 'white',
                        height: '80px',
                        boxShadow: 'rgb(0 0 0 / 8%) 0 1px 0',
                        zIndex: '2',
                        paddingLeft: '0 !important',
                        paddingRight: '0 !important',
                        maxWidth: '100% !important'
                    }}
                    maxWidth="xl"
                >
                    <Toolbar 
                    sx={{
                        pl: 8,
                        pr: 8,
                    }}
                    disableGutters
                    >
                        <SiteLogo 
                            style={{
                                width: '30px',
                                marginLeft: '10px',
                                height: '80px',
                            }} 
                        />
                        <Typography
                        variant='h6'
                        sx={{
                            color: '#3B82F6',
                            fontSize: '15px',
                            marginLeft: '10px',
                            lineHeight: '16px',
                            fontWeight: '600',
                        }}
                        >
                            Home Away <br /> From Home
                        </Typography>
                        <Paper
                            component='form'
                            sx={{
                                p: '1px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #3B82F6',
                                borderRadius: '40px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
                                minWidth: '360px',
                                alignSelf: 'center',
                                mx: 'auto',
                                transition: 'box-shadow 0.2s ease',
                                ':hover': {
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                                }
                            }}
                        >
                            <Typography
                                sx={{
                                    ml: 2,
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: '#3B82F6',
                                }}
                            >
                                Anywhere
                            </Typography>
                            <Divider 
                                sx={{
                                    height: 28,
                                    ml: 1,
                                    background: '#3B82F6',
                                }} 
                                orientation='vertical'
    
                            />
                            <InputBase
                                sx={{
                                    ml: 1,
                                    flex: 1,
                                    fontSize: '14px',
                                }}
                                placeholder='Search your dream place'
                            />
                            <IconButton 
                                sx={{
                                    background: '#3B82F6',
                                    margin: '5px',
                                    ':hover': {
                                        background: '#3B82F6',
                                    }
                                }}
                                size='small'
                            >
                                <SearchIcon
                                    sx={{
                                        color: 'white'
                                    }}
                                />
                            </IconButton>
                        </Paper>
                        <Button 
                            endIcon={<SendIcon />}
                            size='small'
                            variant='text'
                            sx={{
                                fontSize: '15px',
                                textTransform: 'none',
                                ':hover': {
                                    borderRadius: '40px',
                                }
                            }}>
                            Submit your data
                        </Button>
                        <Box sx={{m: 1}} />
                        <IconButton
                        sx={{
                            paddingLeft: '6px',
                            paddingRight: '4px',
                            paddingTop: '3px',
                            paddingBottom: '3px',
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #3B82F6',
                            borderRadius: '40px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
                            ':hover': {
                                background: 'white',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                            }
                        }}
                        size='large'>
                            <MenuIcon sx={{ color : '#3B82F6' }} fontSize='medium' />
                            <Box sx={{m: '2px'}} />
                            <AccountCircle sx={{ color: '#3B82F6' }} fontSize='large' />
                        </IconButton>
                    </Toolbar>
                </Container>
                <Container
                    sx={{
                        background: 'white',
                        height: '90px',
                        boxShadow: 'rgb(0 0 0 / 8%) 0 1px 0',
                        zIndex: '1',
                        paddingLeft: '0 !important',
                        paddingRight: '0 !important',
                        maxWidth: '100% !important',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    maxWidth="xl"
                >
                    <Toolbar 
                        sx={{
                            pl: 8,
                            pr: 8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            gap: '40px',
                        }}
                        disableGutters
                    >
                        <CategoryOption
                        label='By Region'
                        icon={
                            <LandscapeIcon
                                sx={{
                                    color: 'black',
                                }}
                                fontSize='large'
                            />
                        }
                        />
                        <CategoryOption
                        label='By City'
                        icon={
                            <LocationCityIcon
                                sx={{
                                    color: 'black',
                                }}
                                fontSize='large'
                            />
                        }
                        />
                        <CategoryOption
                        label='By Employer'
                        icon={
                            <BadgeIcon
                                sx={{
                                    color: 'black',
                                }}
                                fontSize='large'
                            />
                        }
                        />
                        <CategoryOption
                        label='By Cost'
                        icon={
                            <PaidIcon
                                sx={{
                                    color: 'black',
                                }}
                                fontSize='large'
                            />
                        }
                        />
                        <CategoryOption
                        label='By Jobs'
                        icon={
                            <WorkIcon
                                sx={{
                                    color: 'black',
                                }}
                                fontSize='large'
                            />
                        }
                        />
                        <CategoryOption
                        label='By Growth'
                        icon={
                            <AutoGraphIcon
                                sx={{
                                    color: 'black',
                                }}
                                fontSize='large'
                            />
                        }
                        />
                        <CategoryOption
                        label='By Debt'
                        icon={
                            <MoneyOffIcon
                                sx={{
                                    color: 'black',
                                }}
                                fontSize='large'
                                className='option-icon'
                            />
                        }
                        />
                    </Toolbar>
                </Container>
            </AppBar>
            <Map 
                initialViewState={{
                    longitude: -122.4,
                    latitude: 37.8,
                    zoom: 5
                }}
                style={{width: '100vw', height: '100vh'}}
                mapStyle="mapbox://styles/mapbox/streets-v12"
            />
        </Box>
    )
}

export default HomePage;