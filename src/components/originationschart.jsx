import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import { compactDAILabel, parseDate } from "../format";
import { useStoreState } from "easy-peasy";
import { Box, ResponsiveContext } from "grommet";

export const OriginationsChart = () => {
  const size = useContext(ResponsiveContext);

  const weeklyOriginations = useStoreState((state) => state.weeklyOriginations);

  let prepareData = () => {
    let labels = [];
    let originations = [];
    let count = [];
    weeklyOriginations.forEach((d) => {
      labels.push(parseDate(d.date));
      originations.push(d.amount);
      count.push(d.count);
    });
    return {
      labels: labels,
      datasets: [
        {
          label: "Originations",
          data: originations,
          lineTension: 0,
          pointRadius: 0,
          backgroundColor: "rgba(39, 98, 255, 0.9)",
        },
      ],
    };
  };

  let prepareOptions = (size) => {
    return {
      maintainAspectRatio: false, // Don't maintain w/h ratio
      scales: {
        yAxes: [
          {
            ticks: {
              // Include a dollar sign in the ticks
              callback: (value, index, values) => {
                return compactDAILabel(value);
              },
            },
            stacked: true,
          },
        ],
        xAxes: [
          {
            ticks: {
              minRotation: size === "small" ? 90 : 0,
              maxRotation: 90,
            },
            stacked: true,
          },
        ],
      },
    };
  };

  return (
    <Box flex="grow">
      <Bar data={prepareData()} options={prepareOptions(size)} />
    </Box>
  );
};
