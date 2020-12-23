import { BigNumber } from "bignumber.js";

export const parseDecimal = (str) => {
  let num = new BigNumber(str);
  return num.div(new BigNumber("1000000000000000000"));
};

export const parseDate = (str) => {
  let date = new Date(parseInt(str) * 1000);
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
};

export const formatDAI = (num) => {
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

export const formatDAI = (num) => {
  return "DAI "+formatValue(num)
}

export const compactDAILabel = (num) => {
  return formatValue(new BigNumber(num).div(new BigNumber(1000000)))+"M"
}


export const toDAINumberFormat = (str) => {
  return formatDAI(new BigNumber(str));
};

export const strToDAINumberFormat = (str) => {
  return toDAINumberFormat(parseDecimal(str));
};
