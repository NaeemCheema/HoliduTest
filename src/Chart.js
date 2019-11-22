import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import _ from 'lodash';

// Generate Data
function createData(country, score) {
  return { country, score };
}

export default function Chart(props) {

  var data = [];
  if(props.list === 'dashboard'){
    data = _.map(props.groupedData, (val, uid) => {
      var size = val.length;
      return createData(uid, size);
    });
  }

  if(props.list === 'country'){
    data = _.map(props.groupedData, (val, uid) => {
      var size = (val.sum / val.count);
      return createData(uid, size);
    });
  }

  if(props.list === 'gender'){
    data = _.map(props.groupedData, (val, uid) => {
      var size = (val.sum / val.count);
      return createData(uid, size);
    });
  }

  return (
    <React.Fragment>
      <Title>Score statistics</Title>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="country" />
          <YAxis>
            <Label angle={270} position="left" style={{ textAnchor: 'middle' }}>
              Average score
            </Label>
          </YAxis>
          <Bar type="monotone" dataKey="score" fill="#556CD6" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
