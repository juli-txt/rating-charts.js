import * as d3 from "d3";
import { getTooltip, hideTooltip, showTooltip } from "../../utils";

/**
 * @typedef {object} LineGraphDataProps
 * @property {number} value - The rating value to be displayed in the graph.
 * @property {number=} deviation - The rating deviation to be displayed in the graph.
 * @property {Date} timestamp - The timestamp of the rating to be displayed in the graph.
 */

/**
 * @typedef {object} LineGraphOptions
 * @property {string} selector - The selector to render the graph in a div.
 * @property {string=} color - The color of the graph.
 * @property {object} margins - The margins of the graph.
 * @property {number=} margins.marginBottom - The bottom margin of the graph.
 * @property {number=} margins.marginLeft - The left margin of the graph.
 * @property {number=} margins.marginRight - The right margin of the graph.
 * @property {number=} margins.marginTop - The top margin of the graph.
 * @property {object} size - The size of the graph.
 * @property {number=} size.height - The height of the graph.
 * @property {number=} size.width - The width of the graph.
 * @property {object} titles - The titles of the graph.
 * @property {string=} titles.title - The general title of the graph.
 * @property {string=} titles.xAxisTitle - The x-axis title of the graph.
 * @property {string=} titles.yAxisTitle - The y-axis title of the graph.
 * @property {object} tooltips - The tooltips of the graph to provide additional information.
 * @property {() => string=} tooltips.setAreaTooltip - The function to set the tooltip for the area.
 * @property {(_value: number, _deviation: number, _timestamp: string) => string=} tooltips.setDataTooltip - The function to set the tooltip for the data.
 * @property {(_value: number, _timestamp: string) => string=} tooltips.setLowerDeviationTooltip - The function to set the tooltip for the lower deviation line.
 * @property {(_value: number, _timestamp: string) => string=} tooltips.setUpperDeviationTooltip - The function to set the tooltip for the upper deviation line.
 * @property {(_minValue: string, _maxValue: string) => string=} tooltips.setXAxisTooltip - The function to set the tooltip for the x-axis.
 * @property {(_minValue: number, _maxValue: number) => string=} tooltips.setYAxisTooltip - The function to set the tooltip for the y-axis.
 */

/**
 * Renders a line graph.
 *
 * @param {Array<LineGraphDataProps>} data - The rating data to be displayed in the graph. Contains the timestamp, value and deviation.
 * @param {number} minRatingValue - The minimum value of the rating for the y-axis.
 * @param {LineGraphOptions} options - The options for the graph.
 * @returns {void} - The line graph is rendered in the DOM.
 */
export function LineGraph(data, minRatingValue, options) {
  /**
   * Parameters.
   */
  // Destructure the parameters and initialize them with default values.
  const {
    selector,
    color = "navy",
    margins: {
      marginTop = 40,
      marginRight = 40,
      marginBottom = 40,
      marginLeft = 40,
    } = {},
    size: { width = 640, height = 400 } = {},
    titles: { title = "", xAxisTitle = "", yAxisTitle = "" } = {},
    tooltips: {
      setAreaTooltip = () => "",
      setDataTooltip = (_value, _deviation, _timestamp) => "",
      setLowerDeviationTooltip = (_value, _timestamp) => "",
      setUpperDeviationTooltip = (_value, _timestamp) => "",
      setXAxisTooltip = (_minValue, _maxValue) => "",
      setYAxisTooltip = (_minValue, _maxValue) => "",
    } = {},
  } = options;

  /**
   * SVG container.
   */
  // Remove any existing graph.
  const container = d3.select(selector);
  container.selectAll("*").remove();

  /**
   * Title.
   */
  // Render the title of the graph.
  container
    .append("div")
    .style("text-align", "center") // Center the title
    .style("margin-bottom", "10px") // Add space between the title and the graph
    .append("h3")
    .text(title)
    .style("text-decoration", "underline")
    .style("font-family", "Georgia");

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

  // Sort the data by timestamp ascending.
  data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Get the start and end date from the data.
  const startDate = data[0].timestamp;
  const endDate = data[data.length - 1].timestamp;

  // Create the horizontal scale.
  const x = d3
    .scaleTime()
    .domain([startDate, endDate])
    .range([marginLeft, width - marginRight]);

  // Calculate the number of ticks on the x-axis.
  const timeDifference =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  const xTicks = timeDifference > 8 ? 8 : timeDifference;

  // Calculate the tick interval
  const tickValues = d3.timeDay.range(
    startDate,
    endDate,
    Math.ceil(timeDifference / xTicks)
  );

  // Add the x-axis.
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - marginBottom})`)
    // @ts-ignore
    .call(
      d3
        .axisBottom(x)
        .tickValues(tickValues)
        // @ts-ignore
        .tickFormat(d3.timeFormat("%Y-%m-%d"))
    )
    .attr("font-family", "Georgia")
    .on("mouseover", (event, _) =>
      showTooltip(
        tooltip,
        event,
        setXAxisTooltip(startDate.toISOString(), endDate.toISOString())
      )
    )
    .on("mouseout", () => hideTooltip(tooltip));

  // Label for the y-axis.
  svg
    .append("text")
    .attr("x", marginLeft / 5)
    .attr("y", marginTop / 1.25)
    .style("text-anchor", "start")
    .text(yAxisTitle)
    .attr("font-family", "Georgia");

  /**
   * y-axis.
   */
  // Set deviation to 0 if it is not defined.
  data.forEach((d) => {
    if (!d.deviation) {
      d.deviation = 0;
    }
  });

  // Get the max value of the data.
  // @ts-ignore
  const maxRatingValue = d3.max(data, (d) => d.value + d.deviation);

  // Create the vertical scale.
  const y = d3
    .scaleLinear()
    // @ts-ignore
    .domain([minRatingValue, maxRatingValue])
    .range([height - marginBottom, marginTop]);

  // Add the y-axis.
  const yAxis = svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .call(d3.axisLeft(y))
    .attr("font-family", "Georgia")
    .on("mouseover", (event, _) =>
      showTooltip(
        tooltip,
        event,
        // @ts-ignore
        setYAxisTooltip(minRatingValue, maxRatingValue)
      )
    )
    .on("mouseout", () => hideTooltip(tooltip));

  // Get the number of ticks on the y-axis.
  const yTicks = yAxis.selectAll(".tick").data();

  // Add horizontal spectral lines.
  svg
    .selectAll("line.spectral")
    .data(yTicks)
    .enter()
    .append("line")
    .attr("x1", marginLeft)
    .attr("x2", width - marginRight)
    .attr("y1", (d) => y(d))
    .attr("y2", (d) => y(d))
    .attr("stroke", "gray")
    .attr("stroke-width", 1)
    .attr("opacity", 0.5);

  /**
   * Data visualization.
   */
  // Fill the area between the deviation lines.
  svg
    .append("path")
    .attr("class", "area")
    .datum(data)
    .attr("fill", color)
    .attr("stroke", color)
    .attr("stroke-width", "1.5")
    .attr("opacity", 0.2)
    .attr(
      "d",
      // @ts-ignore
      d3
        .area()
        // @ts-ignore
        .x((d) => x(d.timestamp))
        // @ts-ignore
        .y0((d) => y(d.value - d.deviation))
        // @ts-ignore
        .y1((d) => y(d.value + d.deviation))
        .curve(d3.curveLinear)
    )
    .on("mouseover", (event, _) =>
      showTooltip(tooltip, event, setAreaTooltip())
    )
    .on("mouseout", () => hideTooltip(tooltip));

  // Calculates the values for the line.
  const valueLine = d3
    .line()
    // @ts-ignore
    .x((d) => x(d.timestamp))
    // @ts-ignore
    .y((d) => y(d.value))
    .curve(d3.curveLinear);

  // Renders the line.
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", "1.5")
    .attr("opacity", 0.75)
    // @ts-ignore
    .attr("d", valueLine(data));

  // Renders the data points.
  svg
    .selectAll("circle.value")
    .data(data)
    .join("circle")
    .attr("class", "data-point")
    .attr("cx", (d) => x(d.timestamp))
    .attr("cy", (d) => y(d.value))
    .attr("r", 3)
    .attr("fill", color)
    .attr("stroke", color)
    .attr("stroke-width", "1")
    .attr("opacity", 0.75)
    .on("mouseover", (event, d) =>
      showTooltip(
        tooltip,
        event,
        // @ts-ignore
        setDataTooltip(d.value, d.deviation, d.timestamp.toISOString())
      )
    )
    .on("mouseout", () => hideTooltip(tooltip));

  // Upper deviation line.
  // Calculates the values for the upper deviation line.
  const upperDeviationLine = d3
    .line()
    // @ts-ignore
    .x((d) => x(d.timestamp))
    // @ts-ignore
    .y((d) => y(d.value + d.deviation))
    .curve(d3.curveLinear);

  // Renders the upper deviation line.
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", "1.5")
    .attr("opacity", 0.4)
    // @ts-ignore
    .attr("d", upperDeviationLine(data));

  // Renders the upper deviation data points.
  svg
    .selectAll("circle.upper-deviation")
    .data(data)
    .join("circle")
    .attr("class", "upper-deviation")
    .attr("cx", (d) => x(d.timestamp))
    // @ts-ignore
    .attr("cy", (d) => y(d.value + d.deviation))
    .attr("r", 3)
    .attr("fill", color)
    .attr("stroke", color)
    .attr("stroke-width", "1")
    .attr("opacity", 0.4)
    .on("mouseover", (event, d) =>
      showTooltip(
        tooltip,
        event,
        setUpperDeviationTooltip(
          // @ts-ignore
          d.value + d.deviation,
          d.timestamp.toISOString()
        )
      )
    )
    .on("mouseout", () => hideTooltip(tooltip));

  // Lower deviation line.
  // Calculates the values for the lower deviation line.
  const lowerDeviationLine = d3
    .line()
    // @ts-ignore
    .x((d) => x(d.timestamp))
    // @ts-ignore
    .y((d) => y(d.value - d.deviation))
    .curve(d3.curveLinear);

  // Renders the lower deviation line.
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", "1.5")
    .attr("opacity", 0.4)
    // @ts-ignore
    .attr("d", lowerDeviationLine(data));

  // Renders the lower deviation data points.
  svg
    .selectAll("circle.lower-deviation")
    .data(data)
    .join("circle")
    .attr("class", "lower-deviation")
    .attr("cx", (d) => x(d.timestamp))
    // @ts-ignore
    .attr("cy", (d) => y(d.value - d.deviation))
    .attr("r", 3)
    .attr("fill", color)
    .attr("stroke", color)
    .attr("stroke-width", 1)
    .attr("opacity", 0.4)
    .on("mouseover", (event, d) =>
      showTooltip(
        tooltip,
        event,
        setLowerDeviationTooltip(
          // @ts-ignore
          d.value - d.deviation,
          d.timestamp.toISOString()
        )
      )
    )
    .on("mouseout", () => hideTooltip(tooltip));
}
