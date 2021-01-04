import React, { useContext } from "react";
import { Box, ResponsiveContext } from "grommet";
import { Line } from "react-chartjs-2";
import { parseDecimal, parseDate, compactDAILabel } from "../format";
import { useStoreState } from "easy-peasy";

export const AssetValueAreaChart = () => {
  const size = useContext(ResponsiveContext);

  const dailyAssetValue = useStoreState((state) => state.dailyAssetValue);

  let prepareData = () => {
    let labels = [];
    let assetValue = [];
    let reserve = [];
    dailyAssetValue.days.forEach((d, i) => {
      labels.push(parseDate(d.id));
      assetValue.push(parseDecimal(d.assetValue));
      reserve.push(parseDecimal(d.reserve));
    });

    return {
      labels: labels,
      datasets: [
        {
          label: "Asset Value",
          data: assetValue,
          lineTension: 0,
          pointRadius: 0,
          backgroundColor: "rgba(39, 98, 255, 0.9)",
        },
        {
          label: "Reserve",
          data: reserve,
          lineTension: 0,
          pointRadius: 0,
          backgroundColor: "rgba(39, 98, 255, 0.5)",
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
      <Line data={prepareData()} options={prepareOptions(size)} />
    </Box>
  );
};
