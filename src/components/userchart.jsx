import React, { useContext } from "react";
import { Box, ResponsiveContext } from "grommet";
import { Line } from 'react-chartjs-2'
import { parseDate } from '../format'
import { useStoreState } from 'easy-peasy';

export const UserChart = () => {
    const size = useContext(ResponsiveContext);
    const dailyUsers = useStoreState((state) => state.dailyUsers);

    let prepareData = () => {
      let labels = []
      let userCount = []
      for (const [key, value] of Object.entries(dailyUsers)) {
        labels.push(parseDate(key))
        userCount.push(value.count)
      }

      return {
        labels: labels,
        datasets: [
          {
            label: "Investors",
            data: userCount,
            lineTension: 0,
            pointRadius:0,
            backgroundColor: 'rgba(39, 98, 255, 0.9)'
          },
        ]
      }
    }

    let prepareOptions = (size) => {
        return {
            maintainAspectRatio: false,
            scales: {
              yAxes: [{
                ticks: {
                    minRotation: size === "small" ? 90 : 0,
                    maxRotation: 90,
                    callback: (value, index, values) => {
                        return value
                    }
                },
                stacked: true
              }]
            }
        }
    }
    return (
     <Box flex="grow">
          <Line data={prepareData()} options={prepareOptions(size)} />
    </Box>
    )
}


