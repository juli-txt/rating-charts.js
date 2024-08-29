import * as d3 from "d3";
import {
  getTooltip,
  hideTooltip,
  showTooltip,
  formatNumber,
  getDeviationColorValue,
  getTextWidth,
} from "../../utils";

/**
 * @typedef {object} RatingDataProps
 * @property {number} ratingValue - The rating value to be displayed.
 * @property {number} ratingValueTrend - The rating value trend to be displayed.
 * @property {number=} ratingDeviation - The rating deviation to be displayed.
 * @property {number=} ratingDeviationTrend - The rating deviation trend to be displayed.
 * @property {number=} maxRatingDeviation - The maximum rating deviation to calculate the color effect.
 */

/**
 * @typedef {object} RatingOptions
 * @property {string} selector - The selector to render the chart in a div.
 * @property {string=} title - The general title of the chart.
 * @property {object} tooltips - The tooltips of the chart to provide additional information.
 * @property {(_deviation: number) => string=} tooltips.setDeviationTooltip - The function to set the tooltip for the deviation.
 * @property {(_deviationTrend: number) => string=} tooltips.setDeviationTrendTooltip - The function to set the tooltip for the trend of the deviation.
 * @property {(_value: number) => string=} tooltips.setValueTooltip - The function to set the tooltip for the value.
 * @property {(_valueTrend: number) => string=} tooltips.setValueTrendTooltip - The function to set the tooltip for the trend of the value.
 * @property {number=} width - The width of the chart.
 */

/**
 * Renders a rating value and rating deviation.
 *
 * @param {RatingDataProps} data - The rating to be visualized.
 * @param {RatingOptions} options - The options for the chart.
 * @return {void} - The rating value and deviation are rendered in the DOM.
 */
export function Rating(data, options) {
  /**
   * Parameters.
   */
  // Destructure the parameters and initialize them with default values.
  const {
    ratingValue,
    ratingValueTrend,
    ratingDeviation,
    ratingDeviationTrend = 0,
    maxRatingDeviation = 0,
  } = data;
  const {
    selector,
    title = "",
    tooltips: {
      setDeviationTooltip = (_deviation) => "",
      setDeviationTrendTooltip = (_deviationTrend) => "",
      setValueTooltip = (_value) => "",
      setValueTrendTooltip = (_valueTrend) => "",
    } = {},
    width = 400,
  } = options;

  // Set the height to half of the width.
  const height = width * 0.5;

  /**
   * SVG container.
   */
  // Remove the existing SVG container.
  const container = d3.select(selector);
  container.selectAll("*").remove();

  // Create a new SVG container.
  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Create a tooltip.
  // @ts-ignore
  const tooltip = getTooltip(container);

  /**
   * Data visualization.
   */
  // Calculate a dynamic font size.
  const adjustedFontSize = 72 * (height / 200);

  // Calculate the width of the value text.
  const valueTextWidth = getTextWidth(
    // @ts-ignore
    svg,
    formatNumber(ratingValue, 4),
    adjustedFontSize
  );

  // Calculate the width of the deviation text.
  const deviationTextWidth = ratingDeviation
    ? getTextWidth(
        // @ts-ignore
        svg,
        `±${formatNumber(ratingDeviation, 3)}`,
        adjustedFontSize * 0.75
      )
    : 0;

  // Calculate the width of the value trend icon.
  const valueTrendWidth = height * 0.19;
  const deviationTrendWidth = height * 0.125;

  // Calculate total width of all elements.
  const totalWidth =
    valueTextWidth + valueTrendWidth + deviationTextWidth + deviationTrendWidth;

  // Add text for rating value and value trend icon.
  const valueText = svg
    .append("text")
    .attr("x", (width - totalWidth) / 2 + valueTextWidth / 2)
    .attr("y", height * 0.65)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "auto")
    .attr("font-size", adjustedFontSize)
    .attr("font-family", "Georgia");

  // Format the rating value to have four characters.
  const formattedValue = formatNumber(ratingValue, 4);

  // Add the rating value.
  valueText
    .append("tspan")
    .attr("class", "value")
    .attr("fill", "black")
    .text(formattedValue)
    .on("mouseover", (event) =>
      showTooltip(tooltip, event, setValueTooltip(ratingValue))
    )
    .on("mouseout", () => hideTooltip(tooltip));

  // Add the value trend icon.
  svg
    .append("image")
    .attr("class", "value-trend")
    .attr(
      "href",
      ratingValueTrend > 0
        ? "src/assets/up-arrow-svgrepo-com.svg"
        : "src/assets/up-arrow-svgrepo-com.svg"
    )
    .attr("width", valueTrendWidth)
    .attr("height", valueTrendWidth)
    .attr("x", (width - totalWidth) / 2 + valueTextWidth)
    .attr("y", height * 0.36)
    .on("mouseover", (event) =>
      showTooltip(tooltip, event, setValueTrendTooltip(ratingValueTrend))
    )
    .on("mouseout", () => hideTooltip(tooltip));

  // Check if data contains rating deviation.
  if (ratingDeviation !== undefined) {
    // Add text for rating deviation and deviation trend.
    const deviationText = svg
      .append("text")
      .attr(
        "x",
        (width - totalWidth) / 2 +
          valueTextWidth +
          valueTrendWidth +
          deviationTextWidth / 2
      )
      .attr("y", height * 0.41)
      .attr("text-anchor", "middle")
      .attr("font-size", adjustedFontSize * 0.75)
      .attr("font-family", "Georgia");

    // Calculate the grey tone of the deviation.
    const colorValue = getDeviationColorValue(
      ratingDeviation,
      maxRatingDeviation
    );
    const deviationColor = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;

    // Add +- symbol.
    deviationText
      .append("tspan")
      .attr("fill", deviationColor)
      .attr("font-size", adjustedFontSize * 0.75)
      .attr("dominant-baseline", "hanging")
      .text("±");

    // Format the rating deviation to have three characters.
    const formattedDeviation = formatNumber(ratingDeviation, 3);

    // Add the rating deviation.
    deviationText
      .append("tspan")
      .attr("class", "deviation")
      .attr("fill", deviationColor)
      .attr("font-size", adjustedFontSize * 0.75)
      .attr("dominant-baseline", "hanging")
      .text(formattedDeviation)
      .on("mouseover", (event) =>
        showTooltip(tooltip, event, setDeviationTooltip(ratingDeviation))
      )
      .on("mouseout", () => hideTooltip(tooltip));

    // Calculate the x position and width of the deviation trend.
    const deviationTrendWidth = height * 0.125;

    // Add the deviation trend icon.
    svg
      .append("image")
      .attr("class", "deviation-trend")
      .attr(
        "href",
        ratingDeviationTrend > 0
          ? "src/assets/up-arrow-svgrepo-com.svg"
          : "src/assets/up-arrow-svgrepo-com.svg"
      )
      .attr("width", deviationTrendWidth)
      .attr("height", deviationTrendWidth)
      .attr(
        "x",
        (width - totalWidth) / 2 +
          valueTextWidth +
          valueTrendWidth +
          deviationTextWidth
      )
      .attr("y", height * 0.385)
      .on("mouseover", (event) => {
        showTooltip(
          tooltip,
          event,
          setDeviationTrendTooltip(ratingDeviationTrend)
        );
      })
      .on("mouseout", () => hideTooltip(tooltip));
  }

  /**
   * Title.
   */
  // Render the title of the value.
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", height * 0.1)
    .attr("text-anchor", "middle")
    .style("text-decoration", "underline")
    .text(title)
    .attr("font-family", "Georgia");
}
