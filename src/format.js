import { BigNumber } from "bignumber.js";

export const parseDecimal = (str) => {
  let num = new BigNumber(str);
  return num.div(new BigNumber("1000000000000000000"));
};

export const parseDate = (str) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let date = new Date(parseInt(str) * 1000);
  return `${date.getDate()} ${
    months[date.getMonth()]
  } '${date.getFullYear().toString().slice(2)}`;

  // return (
  //   date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  // );
};

export const formatValue = (num) => {
  return (
    "DAI " +
    num.toFormat(2, {
      decimalSeparator: ".",
      // grouping separator of the integer part
      groupSeparator: ",",
      // primary grouping size of the integer part
      groupSize: 3,
    })
  );
};

export const compactDAILabel = (num) => {
  return formatValue(new BigNumber(num).div(new BigNumber(1000000))) + "M";
};


