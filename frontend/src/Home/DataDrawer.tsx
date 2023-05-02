/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Box, Drawer, Typography, Stack, IconButton } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaidIcon from '@mui/icons-material/Paid';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import DataDrawerCard from './DataDrawerCard';
import StarsIcon from '@mui/icons-material/Stars';
import CancelIcon from '@mui/icons-material/Cancel';
import ApprovalIcon from '@mui/icons-material/Approval';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoneyIcon from '@mui/icons-material/Money';
import { DataGrid } from '@mui/x-data-grid';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface DataDrawerProps {
  anchor: Anchor;
  isToggled: boolean;
  info: any;
  cancelButton: any;
}
/* This is a functional component in TypeScript React that renders a drawer with data points. It takes
in four props: `anchor`, `isToggled`, `info`, and `cancelButton`. The `anchor` prop specifies the
position of the drawer, `isToggled` is a boolean that determines whether the drawer is open or
closed, `info` is an object containing information about the data points to be displayed, and
`cancelButton` is a component that allows the user to close the drawer. */
function DataDrawer({
  anchor,
  isToggled,
  info,
  cancelButton,
}: DataDrawerProps) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor: Anchor, open: boolean) => {
    setState({ ...state, [anchor]: open });
  };

  const [jobsData, setJobsData] = useState<any[]>([]);
  const [companiesData, setCompaniesData] = useState<any[]>([]);

  useEffect(() => {
    var job_data: any[] = [];
    info?.properties.top_jobs.forEach((job: any, index: any) => {
      job_data.push({
        id: index,
        job: job.name,
        avgSalary: '$' + job.avgSalary + 'K',
      });
    });
    setJobsData(job_data);

    var companies_data: any[] = [];
    info?.properties.top_companies.forEach((company: any, index: any) => {
      companies_data.push({
        id: index,
        company: company.name,
        success_rate: company.success_rate + '%',
        avgSalary: '$' + company.avgSalary + 'K',
      });
    });
    setCompaniesData(companies_data);
  }, [info]);

  const drawer = (anchor: Anchor, info: any) => (
    <Box
      className='drawer-content'
      sx={{
        zIndex: 1,
        width: '650px',
        m: 2,
        position: 'relative',
      }}
    >
      {cancelButton}
      <Box sx={{ m: 2 }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          border: '1px solid #3B82F6',
          borderRadius: '10px',
          width: 'fit-content',
          boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
          p: '4px 15px',
          color: '#3B82F6',
        }}
      >
        <LocationOnIcon
          sx={{
            color: '#3B82F6',
          }}
        />
        <Box sx={{ m: 0.5 }} />
        <Typography
          sx={{
            fontSize: '25px',
            color: 'black',
          }}
        >
          {info?.properties.name}
        </Typography>
      </Box>
      <Box sx={{ m: 5 }} />
      <Stack
        direction='row'
        sx={{
          alignItems: 'center'
        }}
        spacing={1}
      >
        <BarChartIcon
          sx={{
            color: '#3B82F6',
          }}
          fontSize="large"
        />
        <Typography
          sx={{
            fontSize: '25px',
          }}
        >
          Data Points
        </Typography>
      </Stack>
      <Box sx={{ m: 2 }} />
      <Stack direction="row" spacing={3}>
        <DataDrawerCard
          label="Avg. Cost of Living"
          content={'$' + info?.properties.cost + 'K'}
          icon={
            <AutoGraphIcon
              sx={{
                color: '#3B82F6',
              }}
              fontSize="small"
            />
          }
        />
        <DataDrawerCard
          label="Growth"
          content={info?.properties.growth + '%'}
          icon={
            <AutoGraphIcon
              sx={{
                color: '#3B82F6',
              }}
              fontSize="small"
            />
          }
        />
        <DataDrawerCard
          label="H1B Attractiveness Score"
          content={info?.properties.score}
          icon={
            <StarsIcon
              sx={{
                color: '#3B82F6',
              }}
              fontSize="small"
            />
          }
        />
      </Stack>
      <Box sx={{ m: 4 }} />
      <Stack direction="row" spacing={3}>
        <DataDrawerCard
          label="H1B Volume"
          content={info?.properties.H1B_volume + ' apps'}
          icon={
            <ApprovalIcon
              sx={{
                color: '#3B82F6',
              }}
              fontSize="small"
            />
          }
        />
        <DataDrawerCard
          label="H1B Success Rate"
          content={info?.properties.H1B_success_rate + '%'}
          icon={
            <CheckCircleIcon
              sx={{
                color: '#3B82F6',
              }}
              fontSize="small"
            />
          }
        />
        <DataDrawerCard
          label="Avg. Salary"
          content={'$' + info?.properties.salary + 'K'}
          icon={
            <MoneyIcon
              sx={{
                color: '#3B82F6',
              }}
              fontSize="small"
            />
          }
        />
      </Stack>
      <Box sx={{ m: 4 }} />
      <Stack direction='row'>
        <DataDrawerCard
            label="Debt Score"
            content={info?.properties.debt}
            icon={
              <MoneyOffIcon
                sx={{
                  color: '#3B82F6',
                }}
                fontSize="small"
              />
            }
          />
      </Stack>
      <Box sx={{ m: 5 }} />
      <Stack
        direction='row'
        sx={{
          alignItems: 'center'
        }}
        spacing={1}
      >
        <AssuredWorkloadIcon
          sx={{
            color: '#3B82F6',
          }}
          fontSize="large"
        />
        <Typography
          sx={{
            fontSize: '25px',
          }}
        >
          Top Jobs
        </Typography>
      </Stack>
      <Box sx={{ m: 3 }} />
      <Box>
        <DataGrid
          sx={{
            border: '1px solid #3B82F6',
            borderRadius: '10px',
            boxShadow:
              '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
          }}
          rows={jobsData}
          columns={[
            { field: 'job', headerName: 'Job', flex: 1 },
            { field: 'avgSalary', headerName: 'Average Salary', flex: 1 },
          ]}
        />
      </Box>
      <Box sx={{ m: 5 }} />
      <Stack
        direction='row'
        sx={{
          alignItems: 'center'
        }}
        spacing={1}
      >
        <ApartmentIcon
          sx={{
            color: '#3B82F6',
          }}
          fontSize="large"
        />
        <Typography
          sx={{
            fontSize: '25px',
          }}
        >
          Top Employers
        </Typography>
      </Stack>
      <Box sx={{ m: 3 }} />
      <Box>
        <DataGrid
          sx={{
            border: '1px solid #3B82F6',
            borderRadius: '10px',
            boxShadow:
              '0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)',
          }}
          rows={companiesData}
          columns={[
            { field: 'company', headerName: 'Company', flex: 1 },
            { field: 'success_rate', headerName: 'H1B Success Rate', flex: 1 },
            { field: 'avgSalary', headerName: 'Average Salary', flex: 1 },
          ]}
        />
      </Box>
      <Box sx={{ m: 3 }} />
      <Stack
        direction='row'
        sx={{
          alignItems: 'center'
        }}
        spacing={1}
      >
        <AccountTreeIcon
          sx={{
            color: '#3B82F6',
          }}
          fontSize="large"
        />
        <Typography
          sx={{
            fontSize: '25px',
          }}
        >
          Related
        </Typography>
      </Stack>
      <Box sx={{ m: 3 }} />
      <Stack direction="row" spacing={3}>
        {info?.properties.related.map((property: any) => (
          <DataDrawerCard
            label={property.name}
            content={
              <Stack direction="column" spacing={1}>
                <DataDrawerCard
                  label="Score"
                  content={property.score}
                  icon={
                    <StarsIcon
                      sx={{
                        color: '#3B82F6',
                      }}
                      fontSize="small"
                    />
                  }
                />
                <DataDrawerCard
                  label="Cost"
                  content={'$' + property.cost + 'K'}
                  icon={
                    <PaidIcon
                      sx={{
                        color: '#3B82F6',
                      }}
                      fontSize="small"
                    />
                  }
                />
                <DataDrawerCard
                  label="Avg. Salary"
                  content={'$' + property.salary + 'K'}
                  icon={
                    <AutoGraphIcon
                      sx={{
                        color: '#3B82F6',
                      }}
                      fontSize="small"
                    />
                  }
                />
              </Stack>
            }
            icon={
              <LocationOnIcon
                sx={{
                  color: '#3B82F6',
                }}
                fontSize="small"
              />
            }
          />
        ))}
      </Stack>
    </Box>
  );

  useEffect(() => {
    toggleDrawer(anchor, isToggled);
  }, [isToggled]);

  return (
    <Drawer
      anchor={anchor}
      open={state[anchor]}
      variant="persistent"
      sx={{
        zIndex: 1,
        '.MuiDrawer-paper': {
          paddingTop: '170px',
        },
      }}
      ModalProps={{
        keepMounted: false,
      }}
    >
      {drawer(anchor, info)}
    </Drawer>
  );
}

export default DataDrawer;
