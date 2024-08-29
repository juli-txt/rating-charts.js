import * as d3 from "d3";
import {
  getTooltip,
  hideTooltip,
  showTooltip,
  formatNumber,
} from "../../utils";

/**
 * Renders a histogram.
 *
 * @param {number[]} data - The rating data to be displayed in the diagram. Contains an array of rating values.
 * @param {number} minRatingValue - The minimum value of the rating for the x-axis.
 * @param {number} ratingValue - The specific rating value.
 * @param {object} options - The options for the diagram.
 * @param {string} options.selector - The selector to render the diagram in a div.
 * @param {string=} options.color - The color of the diagram.
 * @param {(_value: string, _percentage: string) => string=} options.setUserInfo - The function to set the information text for the specific user.
 * @param {object} options.margins - The margins of the diagram.
 * @param {number=} options.margins.marginBottom - The bottom margin of the diagram.
 * @param {number=} options.margins.marginLeft - The left margin of the diagram.
 * @param {number=} options.margins.marginRight - The right margin of the diagram.
 * @param {number=} options.margins.marginTop - The top margin of the diagram.
 * @param {object} options.size - The size of the diagram.
 * @param {number=} options.size.height - The height of the diagram.
 * @param {number=} options.size.width - The width of the diagram.
 * @param {object} options.titles - The titles of the diagram.
 * @param {string=} options.titles.title - The general of the diagram.
 * @param {string=} options.titles.xAxisTitle - The x-axis title of the diagram.
 * @param {string=} options.titles.yAxisTitle - The y-axis title of the diagram.
 * @param {object} options.tooltips - The tooltips of the diagram to provide additional information.
 * @param {(_value: string, _percentage: string) => string=} options.tooltips.setUserInfoTooltip - The function to set the tooltip for the user info.
 * @param {(_minValue: number, _maxValue: number) => string=} options.tooltips.setXAxisTooltip - The function to set the tooltip for the x-axis.
 * @param {(_minValue: number, _maxValue: number) => string=} options.tooltips.setYAxisTooltip - The function to set the tooltip for the y-axis.
 * @returns {void} - The histogram is rendered in the DOM.
 */
export function Histogram(data, minRatingValue, ratingValue, options) {
  /**
   * Parameters.
   */
  // Destructure the parameters and initialize them with default values.
  const {
    selector,
    color = "navy",
    setUserInfo = (_value, _percentage) => "",
    margins: {
      marginTop = 40,
      marginRight = 40,
      marginBottom = 40,
      marginLeft = 40,
    } = {},
    size: { width = 700, height = 400 } = {},
    titles: { title = "", xAxisTitle = "", yAxisTitle = "" } = {},
    tooltips: {
      setUserInfoTooltip = (_value, _percentage) => "",
      setXAxisTooltip = (_minValue, _maxValue) => "",
      setYAxisTooltip = (_minValue, _maxValue) => "",
    } = {},
  } = options;

  /**
   * SVG container.
   */
  // Clear the container.
  const container = d3.select(selector);
  container.selectAll("*").remove();

  // Create the SVG element.
  const svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Create the tooltip object.
  // @ts-ignore
  const tooltip = getTooltip(container);

  /**
   * x-axis.
   */
  // Label for the x-axis.
  svg
    .append("text") // text label for the x axis
    .attr("x", width / 2)
    .attr("y", height - marginBottom / 5)
    .style("text-anchor", "middle")
    .text(xAxisTitle)
    .attr("font-family", "Georgia");

  // Create the horizontal scale.
  const x = d3
    .scaleLinear()
    // @ts-ignore
    .domain([minRatingValue, d3.max(data)])
    .range([marginLeft, width - marginRight]);

  // Set the number of bins.
  const binCount = 80;
  const maxValue = d3.max(data);

  // Add the x-axis.
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(binCount / 4))
    .attr("font-family", "Georgia")
    .on("mouseover", (event, _) =>
      // @ts-ignore
      showTooltip(tooltip, event, setXAxisTooltip(minRatingValue, maxValue))
    )
    .on("mouseout", () => hideTooltip(tooltip));

  /**
   * Histogram data.
   */
  // Calculate the bin size.
  // @ts-ignore
  const binSize = (maxValue - minRatingValue) / binCount;

  // Create the histogram function.
  const histogram = d3
    .bin()
    .value((d) => d)
    // @ts-ignore
    .domain(x.domain())
    // @ts-ignore
    .thresholds(d3.range(minRatingValue, maxValue, binSize));

  // Create the bins from the data.
  const bins = histogram(data);

  /**
   * y-axis.
   */
  // Create the vertical scale.
  const y = d3
    .scaleLinear()
    .range([height - marginBottom, marginTop])
    // @ts-ignore
    .domain([0, d3.max(bins, (d) => d.length)]);

  // Label for the y-axis.
  svg
    .append("text")
    .attr("x", marginLeft / 5)
    .attr("y", marginTop / 1.25)
    .style("text-anchor", "start")
    .text(yAxisTitle)
    .attr("font-family", "Georgia");

  // Add the y-axis.
  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .call(d3.axisLeft(y).ticks(10).tickFormat(d3.format("d")))
    .attr("font-family", "Georgia")
    .on("mouseover", (event, _) =>
      showTooltip(
        tooltip,
        event,
        setYAxisTooltip(
          0,
          // @ts-ignore
          d3.max(bins, (d) => d.length)
        )
      )
    )
    .on("mouseout", () => hideTooltip(tooltip));

  /**
   * Data visualization.
   */
  // Draw the data as bars.
  svg
    .selectAll("rect")
    .data(bins)
    .enter()
    .append("rect")
    .attr("x", 1)
    // @ts-ignore
    .attr("transform", (d) => `translate(${x(d.x0)},${y(d.length)})`)
    // @ts-ignore
    .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
    // @ts-ignore
    .attr("height", (d) => height - y(d.length) - marginBottom)
    .style("fill", color)
    .attr("opacity", 0.4);

  // Calculate the percentage of users below the user's rating.
  const numberOfUsersBelow = data.filter((d) => d < ratingValue).length;
  const percentageOfUsersBelow = (numberOfUsersBelow / data.length) * 100;

  // Add a text element to display the rating value of the user.
  const text = svg
    .append("text")
    .attr("class", "user-info")
    .attr("x", x(ratingValue))
    // @ts-ignore
    .attr("y", y(d3.max(bins, (d) => d.length)) + 10)
    .attr("text-anchor", x(ratingValue) < width / 2 ? "start" : "end")
    .attr("fill", color)
    .attr("font-weight", "bold")
    .attr("font-family", "Georgia")
    .on("mouseover", (event, _) =>
      showTooltip(
        tooltip,
        event,
        setUserInfoTooltip(
          formatNumber(ratingValue, 4),
          percentageOfUsersBelow.toFixed(0)
        )
      )
    )
    .on("mouseout", () => hideTooltip(tooltip));

  // Split the text into an array by the newline character.
  const lines = setUserInfo(
    formatNumber(ratingValue, 4),
    percentageOfUsersBelow.toFixed(0)
  ).split("\n");

  // Append a tspan for each line dynamically.
  text
    .selectAll("tspan")
    .data(lines)
    .enter()
    .append("tspan")
    .attr("x", x(ratingValue))
    .attr("dy", (_, i) => (i === 0 ? 0 : "1.2em"))
    .text((d) => d);

  // Calculate the height of the text block dynamically.
  const textBlockHeight =
    lines.length * 1.2 * parseFloat(text.style("font-size"));

  // Add line to indicate the current value of the user.
  svg
    .append("line")
    .attr("x1", x(ratingValue))
    .attr("x2", x(ratingValue))
    // @ts-ignore
    .attr("y1", y(d3.max(bins, (d) => d.length)) + textBlockHeight)
    .attr("y2", height - marginBottom)
    .attr("stroke", color)
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "10");

  /**
   * Title.
   */
  // Render the title of the diagram.
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", marginTop / 3.25)
    .attr("text-anchor", "middle")
    .style("text-decoration", "underline")
    .text(title)
    .attr("font-family", "Georgia");
}
