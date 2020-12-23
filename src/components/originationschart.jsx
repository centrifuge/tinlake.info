import React from "react";
import { Bar } from "react-chartjs-2";
import { compactDAILabel, formatDate, parseDate } from "../format";
import { useStoreState } from "easy-peasy";

export const OriginationsChart = () => {
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

  let prepareOptions = () => {
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
      },
    };
  };

  return (
    <div className="originationsChart">
      <Bar data={prepareData()} options={prepareOptions()} />
    </div>
  );
};
