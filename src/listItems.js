import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentIcon from '@material-ui/icons/Assignment';

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
  </div>
);


const SecondaryListItems = props => {
  return(
    <div>
      {mainListItems}
      <ListSubheader inset>Saved reports</ListSubheader>
      <ListItem button onClick={() => props.handleListItem('gender')}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Scores by gender" />
      </ListItem>
      <ListItem button onClick={() => props.handleListItem('country')}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Scores by country" />
      </ListItem>
    </div>
  )
};

export default SecondaryListItems;
