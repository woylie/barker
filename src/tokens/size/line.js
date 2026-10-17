// in rem
export const baseLineHeight = 1.5;

// multiples of the base line height
const factorNames = {
  0.25: "quarter",
  0.5: "half",
  0.75: "three-quarters",
  1: "single",
  1.5: "one-and-a-half",
  2: "double",
};

var lines = Object.entries(factorNames).reduce(
  (a, [factor, name]) => ({
    ...a,
    [name]: { $value: baseLineHeight * parseFloat(factor) },
  }),
  {},
);

export default {
  size: {
    $type: "number",
    line: lines,
  },
};
