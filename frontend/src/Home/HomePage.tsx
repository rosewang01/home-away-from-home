/* eslint-disable */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import Map, { NavigationControl, Source, Layer } from 'react-map-gl';
import {
  Box,
  AppBar,
  Container,
  Typography,
  Toolbar,
  Paper,
  InputBase,
  IconButton,
  Button,
  Divider,
  Chip,
  Stack,
  Badge,
  TextField,
  Icon,
  CircularProgress,
  Snackbar,
  Alert,
  Modal
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { ReactComponent as SiteLogo } from '../assets/homeawayfromhome.svg';
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
import {
  StateDataLayer,
  StateDataLineLayer,
  StateDataHighlightedLayer,
  GrowthDataLayer,
  DebtDataLayer,
  VolumeDataLayer,
  SuccessRateLayer
} from './StateDataLayer';
import bbox from '@turf/bbox';
import StateToolTip from './StateToolTip';
import type { MapboxStyle, MapRef, MapLayerMouseEvent } from 'react-map-gl';
import DataDrawer from './DataDrawer';
import CancelIcon from '@mui/icons-material/Cancel';
import { CatchingPokemonSharp } from '@mui/icons-material';
import GeocoderControl from './GeoCoder';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import { URLPREFIX } from '../util/api';
import axios from 'axios';
import Menu, { MenuProps } from '@mui/material/Menu';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { DataGrid } from '@mui/x-data-grid';
import { maxHeight } from '@mui/system';

/* The above code is a React component that renders a map with different layers based on the selected
filter option. It fetches data from two different URLs containing GeoJSON files, modifies the data
by adding new properties to each feature object, and sets the modified data as state variables. It
also includes a search bar, a submit button, and a menu button in the app bar. When a feature is
clicked on the map, a data drawer is opened with information about the clicked feature. The
component uses various React hooks such as useState, useRef, useCallback, and useEffect to manage
state and handle events. */


const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const FilterMenu = ( props : MenuProps) => (
  <Menu
  elevation={0}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  {...props}
  sx={{
    '& .MuiPaper-root': {
      border: '1px solid #3B82F6 !important',
      borderRadius: '10px',
      boxShadow:
        '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
      p: '4px 8px',
      marginTop: '8px'
    }
  }}
  />
)

function HomePage() {
  const [filterOption, setFilterOption] = useState('By State');
  const [allStateData, setAllStateData] = useState();
  const [stateList, setStateList] = useState<any>();
  const [allCityData, setAllCityData] = useState();
  const [cityList, setCityList] = useState<any>();
  const [hoverInfo, setHoverInfo] = useState<any>();
  const [clickInfo, setClickInfo] = useState<any>();
  const mapRef = useRef<any>();
  const [drawerState, setDrawerState] = useState(false);
  const [addresses, setAddresses] = useState<any>([]);
  const [addressInput, setAddressInput] = useState('');
  const [addressTarget, setAddressTarget] = useState<any>();
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [employerQuery, setEmployerQuery] = useState('');
  const [employerQueryLoading, setEmployerQueryLoading] = useState(false)
  const [jobQuery, setJobQuery] = useState('');
  const [jobQueryLoading, setJobQueryLoading] = useState(false)
  const [isLoadingAllCitites, setIsLoadingAllCities] = useState(false)
  const [isLoadingAllStates, setIsLoadingAllStates] = useState(false)


  const getRandomNum = (min: number, max: number): number => {
    return Math.round(Math.random() * (max - min) + min);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onHover = useCallback((event: any) => {
    const {
      features,
      point: { x, y },
    } = event;
    const hoveredFeature = features && features[0];

    // prettier-ignore
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
  }, []);

  /**
   * The function takes an event and uses it to calculate the bounding box of a feature, fit the map
   * to that bounding box, and update state variables.
   * @param {any} event - The event parameter is an object that contains information about the event
   * that triggered the onClick function. It is of type "any", which means it can contain any type of
   * data. In this case, it is likely an event object from a map library or API that contains
   * information about the clicked feature.
   */
  const onClick = (event: any) => {
    const feature = event.features[0];
    if (feature) {
      // calculate the bounding box of the feature
      const [minLng, minLat, maxLng, maxLat] = bbox(feature);

      mapRef?.current?.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { duration: 1000 },
      );
      feature.properties.top_jobs = JSON.parse(feature.properties.top_jobs);
      feature.properties.top_companies = JSON.parse(
        feature.properties.top_companies,
      );
      feature.properties.related = JSON.parse(feature.properties.related);
      console.log(feature)
      setClickInfo(feature);
      setDrawerState(true);
    }
  };

  const onDrag = (event: any) => {
    if (event.originalEvent) {
      const { clientX, clientY } = event.originalEvent;
      setHoverInfo({
        ...hoverInfo,
        x: clientX,
        y: clientY,
      });
    }
  };

  const onInputChange = (event : any) => {
    setAddressInput(event.target.value);
  }

  useEffect(() => {
    const fetchStates = async () => {
      setIsLoadingAllStates(true)
      const { data } = await axios.get(`${URLPREFIX}/country/all`);
      console.log(data);
      setStateList(data);
      setIsLoadingAllStates(false)
    }

    fetchStates();
  }, [])

  /* The above code is using the `useEffect` hook to fetch data from a URL that contains a GeoJSON file.
    Once the data is fetched, it is parsed as JSON and then modified by adding new properties to each
    feature object. The modified data is then set as the state using the `setAllStateData` function. The
    `console.log` statement is used to log the modified data to the console. */

  useEffect(() => {
    /* global fetch */
    if (stateList === undefined) {
      return;
    }

    console.log(stateList)

    var normalization = stateList.map( (state: any) => {
      state.score = (state.average_housing_price + state.average_salary + 
        state.h1b_success_rate + state.average_housing_price_growth +
        state.h1b_volume)
      return (state.average_housing_price + state.average_salary + 
        state.h1b_success_rate + state.average_housing_price_growth +
        state.h1b_volume)
    })

    var normalized_H1B = stateList.map( (state : any) => {
      return state.h1b_volume
    })

    var maxValue = Math.max.apply(null, normalization);
    var minValue = Math.min.apply(null, normalization);

    var maxH1BValue = Math.max.apply(null, normalized_H1B);
    var minH1BValue = Math.min.apply(null, normalized_H1B);

    const normalize = (val : any, max : any, min : any) => {
      var score = ((val - min) / (max - min)) * 10;
      score = parseFloat(score.toFixed(1));

      return score; 
    }
    fetch(
      'https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson',
    )
      .then((resp) => resp.json())
      .then((json) => {
        var newFeatures : any[] = []
        json.features.forEach((feature: any, index: any) => {
          console.log(stateList)
          var targetObj = stateList?.find( (obj : any) => {
            return obj.state_name === feature.properties.name
          })
          if (targetObj === undefined) {

          } else {
            feature.properties.debt = Math.round( targetObj.average_housing_price / targetObj.average_salary)
            if (feature.properties.debt == Infinity) {
              feature.properties.debt = 'No info'
            }
            feature.properties.H1B_volume_normalized = normalize(targetObj.h1b_volume, maxH1BValue, minH1BValue)
            feature.properties.state_code = targetObj.state_code;
            feature.properties.score = normalize(targetObj.score, maxValue, minValue);
            feature.properties.cost = Math.round(targetObj.average_housing_price / 1000);
            feature.properties.jobs = 'SWE, PM, DS';
            feature.properties.growth = Math.round(targetObj.average_housing_price_growth * 100);
            feature.properties.H1B_volume = targetObj.h1b_volume;
            feature.properties.H1B_success_rate = Math.round(targetObj.h1b_success_rate * 100);
            feature.properties.H1B_success_rate_normalized = Math.round(targetObj.h1b_success_rate * 10);
            feature.properties.salary = Math.round(targetObj.average_salary / 1000);
            feature.properties.top_jobs = targetObj.top_jobs?.split(";").map((job : any) => {
              var regExp = /\(([^)]+)\)/;
              var matches = regExp.exec(job);
              let job_name = '';
              let success_rate = '';
              let average_salary = 0;
              if (matches != null) {
                job_name = job.replace(matches[0], "")
                success_rate = matches[0].replace("(", "").replace(")", "").split(",")[1]
                average_salary = Math.round(parseInt(matches[0].replace("(", "").replace(")", "").split(",")[0]) / 1000)

              } else {
                job_name = 'No Info'
              }
              return {
                name: job_name,
                avgSalary: average_salary,
                success_rate: success_rate,
              }
            })
            if (targetObj.top_jobs == undefined) {
              feature.properties.top_jobs = []
            }
            feature.properties.top_companies = targetObj.top_employers?.split(";").map((company : any) => {
              var regExp = /\(([^)]+)\)/;
              var matches = regExp.exec(company);
              let employer_name = '';
              let success_rate = '';
              let average_salary = 0;
              if (matches != null) {
                employer_name = company.replace(matches[0], "")
                success_rate = matches[0].replace("(", "").replace(")", "").split(",")[1]
                average_salary = Math.round(parseInt(matches[0].replace("(", "").replace(")", "").split(",")[0]) / 1000)

              } else {
                employer_name = 'No Info'
              }
              return {
                name: employer_name,
                success_rate: success_rate,
                avgSalary: average_salary,
              }
            })
            if (targetObj.top_employers == undefined) {
              feature.properties.top_companies = []
            }
            feature.properties.related = targetObj.similar_states?.map((state : any) =>  {

              const targetState = stateList?.find( (obj : any) => {
                return obj.state_code === state
              })

              return {
                name: targetState.state_name,
                score: normalize(targetState.score, maxValue, minValue),
                cost: Math.round(targetState.average_housing_price / 1000),
                salary: Math.round(targetState.average_salary / 1000),
              }
              
            });
            newFeatures.push(feature);
          }
        });
        json.features = newFeatures;
        setAllStateData(json);
        console.log(json);
      })
      .catch((err) => console.error('Could not load data', err)); // eslint-disable-line
  }, [stateList]);


  useEffect(() => {
    if (stateList === undefined) {
      return;
    }
    const fetchCities = async () => {

      const stateCodes = stateList.map( (state : any) => {
        return state.state_code;
      })
      setIsLoadingAllCities(true)
      // const cities = await Promise.all(
      //   stateCodes.map(async (code : any) => {
      //     const res = await axios.get(`${URLPREFIX}/state/${code}/all`)
      //     return res.data
      //   })
      // )
      const cities = await axios.get(`${URLPREFIX}/state/all`);
      setIsLoadingAllCities(false)
      console.log(cities.data)
      setCityList(cities.data);
    }

    fetchCities();
  }, [stateList])

  /* The above code is using the `useEffect` hook to fetch data from a JSON file containing
    information about cities. It then modifies the data by adding new properties to each city
    object, such as a random score, cost, jobs, and growth. Finally, it sets the modified data to
    the state variable `allCityData` and logs it to the console. */
  useEffect(() => {
    /* global fetch */
    if (cityList === undefined) {
      return;
    }

    var normalization = cityList.map( (state: any) => {
      if (state.h1b_success_rate == undefined) {
        state.h1b_success_rate = 0
      }

      if (state.h1b_volumne == undefined) {
        state.h1b_volume = 0
      }
      state.score = (state.average_salary + 
        state.h1b_success_rate +
        state.h1b_volume)
      return (state.average_salary + 
        state.h1b_success_rate +
        state.h1b_volume)
    })

    var maxValue = Math.max.apply(null, normalization);
    var minValue = Math.min.apply(null, normalization);

    var normalized_H1B = stateList.map( (state : any) => {
      return state.h1b_volume
    })

    var maxH1BValue = Math.max.apply(null, normalized_H1B);
    var minH1BValue = Math.min.apply(null, normalized_H1B);

    const normalize = (val : any, max : any, min : any) => {
      var score = ((val - min) / (max - min)) * 100;
      score = parseFloat(score.toFixed(1));

      return score; 
    }

    fetch(
      'https://raw.githubusercontent.com/trangiabach/cities-geojson-small/main/cities-small.json',
    )
      .then((resp) => resp.json())
      .then((json) => {
        var newFeatures : any[] = []
        json.features.forEach((feature: any, index : any, lis : any) => {
          var targetObj = cityList?.find( (obj : any) => {
            return obj.city_name === feature.properties.NAME
          })
          if (targetObj === undefined) {
            
          } else {
            feature.properties.H1B_volume_normalized = normalize(targetObj.h1b_volume, maxH1BValue, minH1BValue)
            feature.properties.debt = Math.round( targetObj.average_housing_price / targetObj.average_salary)
            if (feature.properties.debt == Infinity) {
              feature.properties.debt = 'No info'
            }
            feature.properties.name = feature.properties.NAME;
            feature.properties.score = normalize(targetObj.score, maxValue, minValue);
          feature.properties.cost = Math.round(targetObj.average_housing_price / 1000);
          feature.properties.jobs = 'SWE, PM, DS';
          feature.properties.growth = Math.round(targetObj.average_housing_price_growth * 100);
          feature.properties.H1B_volume = targetObj.h1b_volume;
          feature.properties.H1B_success_rate = Math.round(targetObj.h1b_success_rate * 100);
          feature.properties.H1B_success_rate_normalized = Math.round(targetObj.h1b_success_rate * 10);
          feature.properties.salary = Math.round(targetObj.average_salary / 1000);
          feature.properties.top_jobs = targetObj.top_jobs?.split(";").map((job : any) => {
            var regExp = /\(([^)]+)\)/;
            var matches = regExp.exec(job);
            let job_name = '';
            let success_rate = '';
            let average_salary = 0;
            if (matches != null) {
              job_name = job.replace(matches[0], "")
              success_rate = matches[0].replace("(", "").replace(")", "").split(",")[1]
              average_salary = Math.round(parseInt(matches[0].replace("(", "").replace(")", "").split(",")[0]) / 1000)

            } else {
              job_name = 'No Info'
            }
            return {
              name: job_name,
              avgSalary: average_salary,
              success_rate: success_rate,
            }
          })
          if (targetObj.top_jobs == undefined) {
            feature.properties.top_jobs = []
          }
          feature.properties.top_companies = targetObj.top_employers?.split(";").map((company : any) => {
            var regExp = /\(([^)]+)\)/;
            var matches = regExp.exec(company);
            let employer_name = '';
            let success_rate = '';
            let average_salary = 0;
            if (matches != null) {
              employer_name = company.replace(matches[0], "")
              success_rate = matches[0].replace("(", "").replace(")", "").split(",")[1]
              average_salary = Math.round(parseInt(matches[0].replace("(", "").replace(")", "").split(",")[0]) / 1000)

            } else {
              employer_name = 'No Info'
            }
            return {
              name: employer_name,
              success_rate: success_rate,
              avgSalary: average_salary,
            }
          })
          if (targetObj.top_employers == undefined) {
            feature.properties.top_companies = []
          }
          feature.properties.related = targetObj.similar_cities?.map((state : any) =>  {

            const targetState = cityList?.find( (obj : any) => {
              return obj.city_name == state
            })

            return {
              name: targetState.city_name,
              score: normalize(targetState.score, maxValue, minValue),
              cost: Math.round(targetState.average_housing_price / 1000),
              salary: Math.round(targetState.average_salary / 1000),
            }
            
          });
          if (feature.properties.related === undefined) {
            feature.properties.related = []
          }
            newFeatures.push(feature);
          }
        });
        json.features = newFeatures;
        console.log("New City Json")
        console.log(json)
        setAllCityData(json);
      })
      .catch((err) => console.error('Could not load data', err)); // eslint-disable-line
  }, [cityList]);

  const selectedState = (hoverInfo && hoverInfo?.feature?.properties.name) || '';
  const filterStates = useMemo(
    () => ['in', 'name', selectedState],
    [selectedState],
  );

  // useEffect(() => {
  //     switch (filterOption) {
  //         case 'By State':

  //             break;
  //     }
  // }, [filterOption])

  const stateData = useMemo(() => {
    return allStateData;
  }, [allStateData]);

  const cityData = useMemo(() => {
    return allCityData;
  }, [allCityData]);


  const open = Boolean(anchorEl);
  const handleFilterMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (event : any) => {
    console.log(event.target.value);
  }

  const [filteringOption, setFilteringOption] = useState("");

  const handleRadioClick = (event : any) => {
    if (event.target.value === filteringOption) {
      setFilteringOption("");
    } else {
      setFilteringOption(event.target.value);
    }
  }

  const handleEmployerValue = (event : any) => {
    console.log(event.target.value)
    setEmployerQuery(event.target.value)
  }

  const handleJobValue = (event : any) => {
    console.log(event.target.value)
    setJobQuery(event.target.value)
  }

  const handleSubmitEmployer = () => {
    const fetchEmployerData = async () => {
      if (filterOption == 'By State') {
        setEmployerQueryLoading(true)
        const { data } = await axios.get(`${URLPREFIX}/country/employer/${employerQuery}`);
        setEmployerQueryLoading(false)
        console.log('Employer')
        console.log(data)
        setStateList(data);
      } else if (filterOption == 'By City') {
        const stateCodes = stateList.map( (state : any) => {
          return state.state_code;
        })
        setEmployerQueryLoading(true)
        const cities = await Promise.all(
          stateCodes.map(async (code : any) => {
            const res = await axios.get(`${URLPREFIX}/state/${code}/employer/${employerQuery}`)
            return res.data
          })
        )
        // const cities = await axios.get(`${URLPREFIX}/state/all`);
        setEmployerQueryLoading(false)
        console.log('Employer')
        console.log(cities)
        setCityList(cities.flat())
      }
    }

    fetchEmployerData();
  }

  const handleSubmitJob = () => {
    const fetchJobData = async () => {
      if (filterOption == 'By State') {
        setJobQueryLoading(true)
        const { data } = await axios.get(`${URLPREFIX}/country/job/${jobQuery}`);
        setJobQueryLoading(false)
        console.log('Job')
        console.log(data)
        console.log(data.length)
        setStateList(data);
        console.log("JOb ")
      } else if (filterOption == 'By City') {
        const stateCodes = stateList.map( (state : any) => {
          return state.state_code;
        })
        setJobQueryLoading(true)
        const cities = await Promise.all(
          stateCodes.map(async (code : any) => {
            const res = await axios.get(`${URLPREFIX}/state/${code}/job/${jobQuery}`)
            return res.data
          })
        )
        // const cities = await axios.get(`${URLPREFIX}/state/all`);
        setJobQueryLoading(false)
        console.log('Job')
        console.log(cities)
        setCityList(cities.flat())
      }
    }

    fetchJobData();
  }

  const [jobData, setJobData] = useState<any>([])
  const [employerData, setEmployerData] = useState<any>([])

  useEffect(() => {
    const fetchJobs = async () => {
      console.log("JOBS DATA")
      const { data } = await axios.get(`${URLPREFIX}/jobs/all`);
      const job_data : any[] = []
      data.forEach( (job : any, index: any) => {
        job_data.push({
          id: index,
          job: job.job_name,
          avgSalary: Math.round(job.average_salary / 1000).toString() + "K",
          success_rate: Math.round(job.h1b_success_rate * 100).toString() + "%",
        })
      })
      setJobData(job_data)
    }

    fetchJobs()

    const fetchEmployers = async () => {
      const { data } = await axios.get(`${URLPREFIX}/employers/all`);
      console.log(data)
      const employer_data : any[] = []
      data.forEach( (job : any, index: any) => {
        employer_data.push({
          id: index,
          employer: job.employer_name,
          avgSalary: Math.round(job.average_salary / 1000).toString() + "K",
          success_rate: Math.round(job.h1b_success_rate * 100).toString() + "%",
        })
      })
      setEmployerData(employer_data)
    }

    fetchEmployers()
  }, [])

  useEffect(() => {
    if (stateList == undefined || cityList == undefined) {
      return;
    }
    if (filteringOption !== 'By Employer' && filteringOption !== 'By Job') {
      const fetchStates = async () => {
        const { data } = await axios.get(`${URLPREFIX}/country/all`);
        setStateList(data);

        const stateCodes = stateList.map( (state : any) => {
          return state.state_code;
        })

        console.log(stateCodes)
        // const cities = await Promise.all(
        //   stateCodes.map(async (code : any) => {
        //     const res = await axios.get(`${URLPREFIX}/state/${code}/all`)
        //     return res.data
        //   })
        // )
        const cities = await axios.get(`${URLPREFIX}/state/all`);
        setCityList(cities.data);
      }
  
      fetchStates();
    }
  }, [filteringOption])

  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<any>({}); 
  const handleOpenModal = (data : any) => {
    setModalData(data)
    setOpenModal(true)
  };


  const handleCloseModal = (data : any) => {
    setModalData(data)
    setOpenModal(false)
  };

  return (
    <Box>
      <AppBar
        sx={{
          background: 'transparent',
          boxShadow: 'none',
        }}
        position="fixed"
      >
        <Container
          sx={{
            background: 'white',
            height: '80px',
            boxShadow: 'rgb(0 0 0 / 8%) 0 1px 0',
            zIndex: '3',
            paddingLeft: '0 !important',
            paddingRight: '0 !important',
            maxWidth: '100% !important',
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
              variant="h6"
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
            <Box
              sx={{
                mx: 'auto',
                position: 'relative',
                minWidth: '360px',
                minHeight: '50px'
              }}
            >
            <Paper
              component="form"
              sx={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translate(-50%, 0)',
                p: '1px 4px',
                paddingRight: '8px',
                display: 'flex',
                alignItems: 'center',
                flexDirection:  'column',
                border: '1px solid #3B82F6',
                borderRadius: '40px',
                boxShadow:
                  '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
                minWidth: '360px',
                alignSelf: 'center',
                transition: 'all 0.2s ease',
                ':hover': {
                  boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                  minWidth: '500px',
                  cursor: 'pointer'
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%'
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
                  orientation="vertical"
                />
                <InputBase
                  sx={{
                    ml: 1,
                    flex: 1,
                    fontSize: '14px',
                  }}
                  placeholder="Search your dream place"
                  onChange={onInputChange}
                  value={addressInput}
                />
                <IconButton
                  sx={{
                    background: '#3B82F6',
                    margin: '5px',
                    ':hover': {
                      background: '#3B82F6',
                    },
                  }}
                  size="small"
                >
                  <SearchIcon
                    sx={{
                      color: 'white',
                    }}
                  />
                </IconButton>
              </Box>
              <Stack
              sx={{
                width: '100%',
                pt: (addresses.length != 0) ? 1 : 0,
                pb: (addresses.length != 0) ? 1 : 0,
                display: (addressInput != addressTarget?.address_name) ? 'flex' : 'none'
              }}
              >
                {addresses.map((address : any) => (
                  <Box
                  sx={{
                    display: 'flex',
                    textAlign: 'left',
                    width: '100%',
                    alignItems: 'center',
                    p: '5px 15px',
                    ":hover": {
                      color: '#3B82F6',
                      '.address-details-text': {
                        color: '#3B82F6',
                      }
                    }
                  }}
                  onClick={() => {
                    setAddressTarget(address)
                    setAddresses([])
                    setAddressInput(address.address_name)
                  }}
                  >
                    <AdsClickIcon
                      sx={{
                        color: '#3B82F6'
                      }}
                    />
                    <Box sx={{ m: 1 }} />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: '16px'
                        }}
                      >
                        {address.address_name}
                      </Typography>
                      <Typography
                        className='address-details-text'
                        sx={{
                          fontSize: '12px',
                          color: 'grey'
                        }}
                      >
                        {address.address_details}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
            </Box>
            {/* <Button
              endIcon={<SendIcon />}
              size="small"
              variant="text"
              sx={{
                fontSize: '15px',
                textTransform: 'none',
                ':hover': {
                  borderRadius: '40px',
                },
              }}
            >
              Submit your data
            </Button>
            <Box sx={{ m: 1 }} />
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
                boxShadow:
                  '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
                ':hover': {
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                },
              }}
              size="large"
            >
              <MenuIcon sx={{ color: '#3B82F6' }} fontSize="medium" />
              <Box sx={{ m: '2px' }} />
              <AccountCircle sx={{ color: '#3B82F6' }} fontSize="large" />
            </IconButton> */}
          </Toolbar>
        </Container>
        <Container
          sx={{
            background: 'white',
            height: '90px',
            boxShadow: 'rgb(0 0 0 / 8%) 0 1px 0',
            zIndex: '2',
            paddingLeft: '0 !important',
            paddingRight: '0 !important',
            maxWidth: '100% !important',
            display: 'flex',
            alignItems: 'center',
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
                boxShadow:
                  '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
                p: '4px 8px',
                ':hover': {
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                },
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
              <Box sx={{ m: 0.3 }} />
              <AutoAwesomeIcon
                sx={{
                  color: '#3B82F6',
                }}
              />
            </Box>
            <CategoryOption
              label="By State"
              icon={
                <LandscapeIcon
                  sx={{
                    color: filterOption === 'By State' ? '#3B82F6' : 'black',
                  }}
                  fontSize="large"
                />
              }
              setOption={setFilterOption}
              selected={filterOption}
            />
            <CategoryOption
              label="By City"
              icon={
                <LocationCityIcon
                  sx={{
                    color: filterOption === 'By City' ? '#3B82F6' : 'black',
                  }}
                  fontSize="large"
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
                boxShadow:
                  '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
                p: '4px 8px',
                ':hover': {
                  cursor: 'pointer',
                  background: 'white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                },
              }}
              onClick={handleFilterMenuClick}
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
              <Box sx={{ m: 0.3 }} />
              <Badge
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: '0.5rem'
                  }
                }}
               badgeContent={(filteringOption == '') ? 'H1B Score' : filteringOption.replace("By ", "").replace("Rate", "")} color='primary'>
                <TuneIcon
                  sx={{
                    color: '#3B82F6',
                  }}
                />
              </Badge>
            </Box>
            <Button
              startIcon={<WorkIcon />}
              size="small"
              variant="text"
              sx={{
                fontSize: '15px',
                textTransform: 'none',
                ':hover': {
                  borderRadius: '40px',
                },
              }}
              onClick={() => {
                handleOpenModal({
                  title: 'Employers',
                  columns: [ 
                    { field: 'employer', headerName: 'Employer Name', flex: 1 },
                    { field: 'avgSalary', headerName: 'Average Salary', flex: 1 },
                    { field: 'success_rate', headerName: 'H1B Success Rate', flex: 1 }
                  ],
                  rows: employerData
                })
              }}
            >
              View all employers
            </Button>
            <Button
              startIcon={<PaidIcon />}
              size="small"
              variant="text"
              sx={{
                fontSize: '15px',
                textTransform: 'none',
                ':hover': {
                  borderRadius: '40px',
                },
              }}
              onClick={() => {
                handleOpenModal({
                  title: 'Jobs',
                  columns: [ 
                    { field: 'job', headerName: 'Job Name', flex: 1 },
                    { field: 'avgSalary', headerName: 'Average Salary', flex: 1 },
                    { field: 'success_rate', headerName: 'H1B Success Rate', flex: 1 }
                  ],
                  rows: jobData
                })
              }}
            >
              View all jobs
            </Button>
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={{
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 700,
                bgcolor: 'background.paper',
                border: '1px solid #3B82F6',
                boxShadow:
                  '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
                p: 4,
                borderRadius: '10px',
                maxHeight: '800px'
              }}>
                <Typography
                  sx={{
                    fontSize: '25px',
                    color: '#3B82F6',
                    fontWeight: '500',
                  }}
                >
                  {modalData?.title}
                </Typography>
                <Box sx={{ m: 2}} />
                <DataGrid
                columns={modalData?.columns}
                rows={modalData?.rows}
                sx={{
                  maxHeight: '600px'
                }}
                />
              </Box>
            </Modal>
            <FilterMenu
            anchorEl={anchorEl}
            open={open}
            onClose={handleFilterMenuClose}
            >
               <FormControl>
                <FormLabel sx={{
                  color: '#3B82F6',
                  mb: 1,
                }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <AutoAwesomeIcon
                      sx={{
                        color: '#3B82F6',
                      }}
                    />
                    <Box sx={{ m: 0.5 }} />
                    <Typography
                    sx={{
                      fontWeight: 500,
                    }}
                    >
                    Filter to see more relationships
                    </Typography>
                  </Box>
                </FormLabel>
                <RadioGroup
                value={filteringOption}
                >
                  <Box
                  sx={{
                    display: 'flex'
                  }}>
                    <FormControlLabel value="By Job" control={<Radio onClick={handleRadioClick} />} label="By Job" />
                    <FormControlLabel value="By Employer" control={<Radio onClick={handleRadioClick}  />} label="By Employer" />
                    <FormControlLabel value="By Growth" control={<Radio onClick={handleRadioClick}  />} label="By Growth" />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex'
                    }}
                  >
                    <FormControlLabel value="By Debt" control={<Radio onClick={handleRadioClick}  />} label="By Debt" />
                    <FormControlLabel value="By H1B Volume" control={<Radio onClick={handleRadioClick}  />} label="By H1B Volume" />
                    <FormControlLabel value="By H1B Success Rate" control={<Radio onClick={handleRadioClick}  />} label="By H1B Success Rate" />
                  </Box>
                </RadioGroup>
              </FormControl>
            </FilterMenu>
          </Toolbar>
        </Container>
        <DataDrawer
          anchor="left"
          isToggled={drawerState}
          info={clickInfo}
          cancelButton={
            <IconButton
              onClick={() => {
                setDrawerState(false);
              }}
              sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
              }}
            >
              <CancelIcon
                sx={{
                  color: '#3B82F6',
                }}
                fontSize="large"
              />
            </IconButton>
          }
        />
        {filteringOption == 'By Employer' && (
           <Box
           sx={{
             width: 'fit-content',
             mx: 'auto',
             background: 'white',
             border: '1px solid #3B82F6',
             p: '10px 14px',
             color: '#3B82F6',
             borderRadius: '10px',
             boxShadow:
               '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
             ':hover': {
               background: 'white',
               boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
             },
             display: 'flex',
             alignItems: 'center',
             mt: 2
           }}
           >
             <Typography
              sx={{
                fontWeight: '500'
               }}
             >
               Desired Employer:
             </Typography>
             <Box sx={{ m: 1}} />
             <TextField
             onChange={handleEmployerValue}
             onKeyDown={(event) => {
              if (event.key === '13'){
                 handleSubmitEmployer()  
              }}}
              label="Employer Name" variant="standard" 
              />
             <IconButton
              onClick={handleSubmitEmployer}
             >
              <SendIcon
                sx={{
                  color: '#3B82F6'
                }}
               />
             </IconButton>
             {employerQueryLoading && (
              <>
              <Box sx={{ m : 1}} />
              <CircularProgress size="1.5rem" color="primary" />
              </>
             )}
           </Box>
        )}
        {filteringOption == 'By Job' && (
           <Box
           sx={{
             width: 'fit-content',
             mx: 'auto',
             background: 'white',
             border: '1px solid #3B82F6',
             p: '10px 14px',
             color: '#3B82F6',
             borderRadius: '10px',
             boxShadow:
               '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
             ':hover': {
               background: 'white',
               boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
             },
             display: 'flex',
             alignItems: 'center',
             mt: 2
           }}
           >
             <Typography
             sx={{
              fontWeight: '500'
             }}
             >
               Desired Job:
             </Typography>
             <Box sx={{ m: 1}} />
             <TextField
             onChange={handleJobValue}
              label="Job Title" variant="standard" />
             <IconButton
              onClick={handleSubmitJob}>
              <SendIcon
                sx={{
                  color: '#3B82F6'
                }}
               />
             </IconButton>
             {jobQueryLoading && (
              <>
              <Box sx={{ m : 1}} />
              <CircularProgress size="1.5rem" color="primary" />
              </>
             )}
           </Box>
        )}
      </AppBar>
      <Map
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 3,
        }}
        style={{ width: '100vw', height: '100vh' }}
        mapStyle="mapbox://styles/mapbox/streets-v12?optimize=true"
        interactiveLayerIds={['data']}
        onMouseMove={onHover}
        onClick={onClick}
        onDrag={onDrag}
        onMouseOut={() => setHoverInfo(null)}
        ref={mapRef}
      >
        {filterOption == 'By State' && (
          <Source type="geojson" data={stateData}>
            {(filteringOption === '' || filteringOption === 'By Employer' || filteringOption === 'By Job') && (
               <Layer beforeId="waterway-label" {...StateDataLayer} />
            )}
            <Layer beforeId="waterway-label" {...StateDataLineLayer} />
            <Layer
              beforeId="waterway-label"
              {...StateDataHighlightedLayer}
              filter={filterStates}
            />
            {filteringOption == 'By Growth' && (
                <Layer
                beforeId="waterway-label"
                {...GrowthDataLayer}
              />
            )}
            {filteringOption == 'By Debt' && (
                <Layer
                beforeId="waterway-label"
                {...DebtDataLayer}
              />
              )}
              {filteringOption == 'By H1B Volume' && (
                <Layer
                beforeId="waterway-label"
                {...VolumeDataLayer}
              />
              )}
              {filteringOption == 'By H1B Success Rate' && (
                <Layer
                beforeId="waterway-label"
                {...SuccessRateLayer}
              />
              )}
          </Source>
        )}
        {filterOption == 'By City' && (
          <>
            <Source type="geojson" data={cityData}>
              {(filteringOption === '' || filteringOption === 'By Employer' || filteringOption === 'By Job') && (
                <Layer beforeId="waterway-label" {...StateDataLayer} />
              )}
              <Layer beforeId="waterway-label" {...StateDataLineLayer} />
              <Layer
                beforeId="waterway-label"
                {...StateDataHighlightedLayer}
                filter={filterStates}
              />
              {filteringOption == 'By Growth' && (
                <Layer
                beforeId="waterway-label"
                {...GrowthDataLayer}
              />
              )}
              {filteringOption == 'By Debt' && (
                <Layer
                beforeId="waterway-label"
                {...DebtDataLayer}
              />
              )}
              {filteringOption == 'By H1B Volume' && (
                <Layer
                beforeId="waterway-label"
                {...VolumeDataLayer}
              />
              )}
               {filteringOption == 'By H1B Success Rate' && (
                <Layer
                beforeId="waterway-label"
                {...SuccessRateLayer}
              />
              )}
            </Source>
          </>
        )}
        {hoverInfo && hoverInfo.feature && <StateToolTip hoverInfo={hoverInfo} />}
        <NavigationControl position="bottom-right" />
        <GeocoderControl 
          mapboxAccessToken={'pk.eyJ1IjoiYmFjaHRyYW4yMiIsImEiOiJjbGdtcm9heXMwM2x1M3BwaHExcHgza3A2In0.HXUhBETMbJMJFTEu11dBWw'} 
          position="bottom-left" 
          setResults={setAddresses}
          addressInput={addressInput}
          queryResult={addressTarget}
          setLoading={setIsAddressLoading}
        />
      </Map>
      <Snackbar anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }} open={isLoadingAllCitites}
      sx={{
        display: 'flex',
        alignItems: 'center'
      }}
      >
        <Alert
         severity="info" 
         sx={{ 
          display: 'flex',
          width: '100%',
          ".MuiAlert-message": {
            display: 'flex'
          }}}>
          <Typography>
          Loading All Cities
          </Typography>
          <Box sx={{ m: 1 }} />
          <CircularProgress size="1.5rem" />
        </Alert>
      </Snackbar>
      <Snackbar anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }} open={isLoadingAllStates}
      sx={{
        display: 'flex',
        alignItems: 'center'
      }}
      >
        <Alert
         severity="info" 
         sx={{ 
          display: 'flex',
          width: '100%',
          ".MuiAlert-message": {
            display: 'flex'
          }}}>
          <Typography>
          Loading All States
          </Typography>
          <Box sx={{ m: 1 }} />
          <CircularProgress size="1.5rem" />
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default HomePage;
