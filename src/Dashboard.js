import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import SecondaryListItems from './listItems';
import Chart from './Chart';
import ScoreTable from './ScoreTable';

const drawerWidth = 240;

function createData(id, firstName, lastName, email, gender, city, country, score, createdAt) {
  return { id, firstName, lastName, email, gender, city, country, score, createdAt };
}

function groupBy(OurArray, property) {  
  return OurArray.reduce(function (accumulatorData, object) {
    // get the value of our object(age in our case) to use for group the array as the array key   
    const key = object[property]; 
    // if the current value is similar to the key(age) don't accumulate the transformed array and leave it empty  
    if (!accumulatorData[key]) {      
      accumulatorData[key] = [];    
    }
    // add the value to the array
    accumulatorData[key].push(object);
    // return the transformed array
    return accumulatorData;  
    // Also we also set the initial value of reduce() to an empty object
  }, {});
}

function groupData(data,property) {
  var groupedData = data.reduce(function(l, r) {
    // construct a unique key out of the properties we want to group by
    var key = property === 'country' ? r.country : r.gender;
  
    // check if the key is already known
    if (typeof l[key] === "undefined") {
      // init with an "empty" object
      l[key] = {
        sum: 0,
        count: 0,
      };
    }
    
    // sum up the values and count the occurences
    l[key].sum += r.score;
    l[key].count += 1;
  
    return l;
  }, {});
  return groupedData;
}

async function fetchData(setRows, setErrors) {
  fetch('http://localhost:3000/api/people.json', {
    method: 'GET',
    headers:{
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    const statusCode = response.status;
    const data = response.json();
    return Promise.all([statusCode, data]);
  })
  .then(([res, data]) => {
    if(res === 200) {
      var newData = data.map(i => {
        return createData(i.id, i.first_name, i.last_name, i.email, i.gender, i.city, i.country, i.score, i.createdAt)
      });

      return setRows(newData);
    }
  })
  .catch((error) => {
    setErrors(error.message);
  })
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));


export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const [setErrors] = useState(false);
  const [rows, setRows] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchData(setRows, setErrors);
  }, [setErrors]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleListItem = (item) => {
    setList(item);
  }
  
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  /* group by countries data by using country property */
  const groupedCountries = groupBy(rows, 'country');
  /* group data countries by using country property to find out the average score */
  const averageScoreGroupedByCountries = groupData(rows,'country');
  /* group data on the basis of gender by using gender property to find out the average score */
  const averageScoreGroupedByGender = groupData(rows,'gender');

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Holidu Interview Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <SecondaryListItems handleListItem={(item) => handleListItem(item)}/>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12}>
              {list !== 'gender' && list !== 'country' &&
                <Paper className={fixedHeightPaper}>
                  <Chart groupedData={groupedCountries} list={'dashboard'}/>
                </Paper>
              }
              {list === 'gender' &&
                <Paper className={fixedHeightPaper}>
                  <Chart groupedData={averageScoreGroupedByGender} list={list}/>
                </Paper>
              }
              {list === 'country' &&
                <Paper className={fixedHeightPaper}>
                  <Chart groupedData={averageScoreGroupedByCountries} list={list}/>
                </Paper>
              }
            </Grid>
            {/* Recent scores */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <ScoreTable rows={rows}/>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
