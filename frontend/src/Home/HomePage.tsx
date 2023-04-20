/* eslint-disable */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Map, {NavigationControl, Source, Layer} from 'react-map-gl';
import { Box, AppBar, Container, Typography, Toolbar, Paper, InputBase, IconButton, Button, Divider, Chip } from '@mui/material';
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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TuneIcon from '@mui/icons-material/Tune';
import GradeIcon from '@mui/icons-material/Grade';
import { StateDataLayer, StateDataLineLayer, StateDataHighlightedLayer } from './StateDataLayer';
import StateToolTip from './StateToolTip';

function HomePage() {
    const [filterOption, setFilterOption] = useState('By State');
    const [allData, setAllData] = useState();
    const [hoverInfo, setHoverInfo] = useState<any>();


    const getRandomNum = (min: number, max: number) : number => {
        return Math.round(Math.random() * (max - min) + min);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onHover = useCallback( (event : any) => {
        const {
          features,
          point: {x, y}
        } = event;
        const hoveredFeature = features && features[0];

        // prettier-ignore
        setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
    }, []);

    useEffect(() => {
        /* global fetch */
        fetch(
          'https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson'
        )
          .then(resp => resp.json())
          .then(json => {
            json.features.forEach((feature : any) => {
                feature.properties.score = getRandomNum(0, 10);
                feature.properties.cost = getRandomNum(100, 500);
                feature.properties.jobs = "SWE, PM, DS"
                feature.properties.growth = getRandomNum(1, 100);
            })
            setAllData(json)
            console.log(json)
        })
          .catch(err => console.error('Could not load data', err)); // eslint-disable-line
    }, []);

    const selectedState = (hoverInfo && hoverInfo.feature.properties.name) || '';
    const filterStates = useMemo(() => ['in', 'name', selectedState], [selectedState]);

    useEffect(() => {
        switch (filterOption) {
            case 'By State':

                break;
        }
    }, [filterOption])


    const data = useMemo(() => {
        return allData;
    }, [allData]);


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
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                border: '1px solid #3B82F6',
                                borderRadius: '10px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
                                p: '4px 8px',
                                ':hover': {
                                    background: 'white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                                }
                            }}
                        >
                            <Typography
                                sx={{
                                    color: '#3B82F6',
                                    fontWeight: 500,
                                    fontSize: '15px',
                                }}
                            >
                                Visualize H1B attractiveness
                            </Typography>
                            <Box sx={{m : 0.3}} />
                            <AutoAwesomeIcon
                                sx={{
                                    color: '#3B82F6'
                                }}
                            />
                        </Box>
                        <CategoryOption
                        label='By State'
                        icon={
                            <LandscapeIcon
                                sx={{
                                    color: (filterOption === 'By State') ? "#3B82F6" : "black",
                                }}
                                fontSize='large'
                            />
                        }
                        setOption={setFilterOption}
                        selected={filterOption}
                        />
                        <CategoryOption
                        label='By City'
                        icon={
                            <LocationCityIcon
                                sx={{
                                    color: (filterOption === 'By City') ? "#3B82F6" : "black",
                                }}
                                fontSize='large'
                            />
                        }
                        setOption={setFilterOption}
                        selected={filterOption}
                        />
                        <CategoryOption
                        label='By Employer'
                        icon={
                            <BadgeIcon
                                sx={{
                                    color: (filterOption === 'By Employer') ? "#3B82F6" : "black",
                                }}
                                fontSize='large'
                            />
                        }
                        setOption={setFilterOption}
                        selected={filterOption}
                        />
                        <CategoryOption
                        label='By Cost'
                        icon={
                            <PaidIcon
                                sx={{
                                    color: (filterOption === 'By Cost') ? "#3B82F6" : "black",
                                }}
                                fontSize='large'
                            />
                        }
                        setOption={setFilterOption}
                        selected={filterOption}
                        />
                        <CategoryOption
                        label='By Jobs'
                        icon={
                            <WorkIcon
                                sx={{
                                    color: (filterOption === 'By Jobs') ? "#3B82F6" : "black",
                                }}
                                fontSize='large'
                            />
                        }
                        setOption={setFilterOption}
                        selected={filterOption}
                        />
                        <CategoryOption
                        label='By Growth'
                        icon={
                            <AutoGraphIcon
                                sx={{
                                    color: (filterOption === 'By Growth') ? "#3B82F6" : "black",
                                }}
                                fontSize='large'
                            />
                        }
                        setOption={setFilterOption}
                        selected={filterOption}
                        />
                        <CategoryOption
                        label='By Debt'
                        icon={
                            <MoneyOffIcon
                                sx={{
                                    color: (filterOption === 'By Debt') ? "#3B82F6" : "black",
                                }}
                                fontSize='large'
                                className='option-icon'
                            />
                        }
                        setOption={setFilterOption}
                        selected={filterOption}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                border: '1px solid #3B82F6',
                                borderRadius: '10px',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
                                p: '4px 8px',
                                ':hover': {
                                    cursor: 'pointer',
                                    background: 'white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                                }
                            }}
                        >
                            <Typography
                                sx={{
                                    color: '#3B82F6',
                                    fontWeight: 500,
                                    fontSize: '15px',
                                }}
                            >
                                Filter
                            </Typography>
                            <Box sx={{m : 0.3}} />
                            <TuneIcon
                                sx={{
                                    color: '#3B82F6'
                                }}
                            />
                        </Box>
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
                mapStyle="mapbox://styles/mapbox/streets-v12?optimize=true"
                interactiveLayerIds={['data']}
                onMouseMove={onHover}
            >
                <Source type="geojson" data={data}>
                    <Layer beforeId="waterway-label" {...StateDataLayer} />
                    <Layer beforeId="waterway-label" {...StateDataLineLayer} />
                    <Layer beforeId="waterway-label" {...StateDataHighlightedLayer} filter={filterStates}/>
                </Source>
                {hoverInfo && (
                    <StateToolTip hoverInfo={hoverInfo} />
                )}
                <NavigationControl
                    position='bottom-right'
                />
            </Map>
        </Box>
    )
}

export default HomePage;