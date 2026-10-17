import { sizes } from "./font.js";
import { baseLineHeight } from "./line.js";

const halfLine = baseLineHeight / 2;
const minimumRatio = 1.5;

const lineHeights = Object.fromEntries(
  Object.entries(sizes).map(([name, { $value }]) => {
    const halfLines = Math.ceil((parseFloat($value) * minimumRatio) / halfLine);
    return [name, { $value: halfLines * halfLine }];
  }),
);

export default {
  size: {
    $type: "dimension",
    "line-height": lineHeights,
  },
};
