/**
 * Prevents the value from being too large or small by formatting it to a string with a maximum length.
 *
 * @param {number} value - The number to be formatted.
 * @param {number} length - The length the number should have as a string.
 * @returns {string} - Number as string with a maximum of x characters excluding the sign and decimal point.
 */
export function formatNumber(value, length) {
  if (typeof value === "undefined" || value === null) {
    return "";
  }

  const sign = getSign(value);
  const stringValue = value.toString();
  const unsignedStringValue = stringValue.includes("-")
    ? value.toString().slice(1)
    : value.toString();

  if (unsignedStringValue.includes(".")) {
    if (unsignedStringValue.indexOf(".") < length) {
      if (unsignedStringValue.length < length + 1) {
        const lengthDifference = length - unsignedStringValue.length + 1;
        return sign + unsignedStringValue + "0".repeat(lengthDifference);
      } else if (unsignedStringValue.length > length + 1) {
        return sign + unsignedStringValue.slice(0, length + 1);
      }
      return sign + unsignedStringValue;
    } else if (unsignedStringValue.indexOf(".") > length) {
      const lengthDifference = unsignedStringValue.indexOf(".") - length + 2;
      return (
        sign + unsignedStringValue.slice(0, length - 2) + "e" + lengthDifference
      );
    }
    return sign + unsignedStringValue.slice(0, length);
  }

  if (unsignedStringValue.length < length) {
    const lengthDifference = length - unsignedStringValue.length;
    return sign + unsignedStringValue + "." + "0".repeat(lengthDifference);
  } else if (unsignedStringValue.length > length) {
    const lengthDifference = unsignedStringValue.length - length + 2;
    return (
      sign + unsignedStringValue.slice(0, length - 2) + "e" + lengthDifference
    );
  }
  return sign + unsignedStringValue;
}

/**
 * Determines the sign of a value.
 *
 * @param {number} value - The value to get the sign from.
 * @returns {string} - The sign of the value.
 */
export function getSign(value) {
  if (value < 0) {
    return "-";
  }
  return "";
}

/**
 *
 * Calculates the width of a text element in pixels.
 *
 * @param {SVGSVGElement} svg - The SVG element to which the text element will be appended.
 * @param {string} text - The text content of the text element.
 * @param {number|string} fontSize - The font size of the text element.
 * @returns {number} - The width of the text element in pixels.
 */
export function getTextWidth(svg, text, fontSize) {
  const tempText = svg
    .append("text")
    // @ts-ignore
    .attr("font-size", fontSize)
    .attr("font-family", "Georgia")
    .text(text);
  const width = tempText.node().getComputedTextLength();
  tempText.remove();
  return width;
}

/**
 *  Calculates the color value for the rating deviation.
 *
 * @param {number} deviation - The rating deviation.
 * @param {number} maxDeviation - The maximum rating deviation.
 * @returns {number} - The color value for the rating deviation.
 */
export function getDeviationColorValue(deviation, maxDeviation) {
  // If maximum deviation is zero, return zero.
  if (maxDeviation === 0) {
    return 0;
  }

  // Calculate the proportion of the deviation relative to the max deviation.
  const ratingDeviationProportion = deviation / maxDeviation;

  // Interpolate between the minimum and maximum color values.
  const minColorValue = 64;
  const maxColorValue = 192;

  // Linear interpolation
  return (
    maxColorValue - (maxColorValue - minColorValue) * ratingDeviationProportion
  );
}
