import * as d3 from "d3";
import {
  getTooltip,
  hideTooltip,
  showTooltip,
  formatNumber,
} from "../../utils";

/**
 * @typedef {Object.<string, number>} SpiderGraphDataProps - The key-value-pair of the rating data.
 */

/**
 * @typedef {object} SpiderGraphOptions
 * @property {string} selector - The selector to render the graph in a div.
 * @property {string=} color - The color of the graph.
 * @property {object} margins - The margins of the graph.
 * @property {number=} margins.marginBottom - The bottom margin of the graph.
 * @property {number=} margins.marginLeft - The left margin of the graph.
 * @property {number=} margins.marginRight - The right margin of the graph.
 * @property {number=} margins.marginTop - The top margin of the graph.
 * @property {(_concept: string, _value: number) => string=} setTooltip - The function to set the tooltip for the values.
 * @property {object} size - The size of the graph.
 * @property {number=} size.height - The height of the graph.
 * @property {number=} size.width - The width of the graph.
 * @property {string=} title - The general title of the graph.
 */

/**
 * Renders a spider graph.
 *
 * @param {SpiderGraphDataProps} data - The rating data to be displayed in the graph. Contains the values for multiple concepts.
 * @param {number} minRatingValue - The minimum value of the rating scale.
 * @param {SpiderGraphOptions} options - The options for the graph.
 * @returns {void} - The spider graph is rendered in the DOM.
 */
export function SpiderGraph(data, minRatingValue, options) {
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
    setTooltip = (_concept, _value) => "",
    size: { width = 500, height = 500 } = {},
    title = "",
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
    .attr("height", height)
    .attr("font-family", "Georgia");

  // Create the tooltip.
  // @ts-ignore
  const tooltip = getTooltip(container);

  /**
   * Axis.
   */
  // Get the concepts of the data.
  const concepts = Object.keys(data);

  // Get the maximum rating value.
  const maxRatingValue = d3.max(concepts, (concept) => data[concept]);

  // Calculate the innerWidth and innerHeight with the margins.
  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  // Scale the chart.
  const scale = d3
    .scaleLinear()
    // @ts-ignore
    .domain([minRatingValue, maxRatingValue])
    .range([0, Math.min(innerWidth, innerHeight) / 3]);

  // Thresholds for the ticks.
  const ticks = d3
    .range(0, 6)
    // @ts-ignore
    .map((i) => minRatingValue + (i / 5) * (maxRatingValue - minRatingValue));

  // Draw the circles.
  svg
    .selectAll("circle")
    .data(ticks)
    .join((enter) =>
      enter
        .append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("r", (d) => scale(d))
    );

  // Label the ticks.
  svg
    .selectAll(".ticklabel")
    .data(ticks)
    .join((enter) =>
      enter
        .append("text")
        .attr("class", "ticklabel")
        .attr("fill", "gray")
        .attr("x", width / 2 + 2)
        .attr("y", (d) => height / 2 - scale(d) - 4)
        .text((d) => formatNumber(d, 4))
    );

  /**
   * Map angle to coordinate.
   *
   * @param {number} angle - The angle to get mapped to coordinates.
   * @param {number} value - The value to get mapped to coordinates.
   * @returns {{x: number, y: number}} - The mapped coordinates.
   */
  function angleToCoordinate(angle, value) {
    const x = Math.cos(angle) * scale(value);
    const y = Math.sin(angle) * scale(value);
    return { x: width / 2 + x, y: height / 2 - y };
  }

  // Create the axis and axis labels.
  const featureData = concepts.map((f, i) => {
    const angle = Math.PI / 2 + (2 * Math.PI * i) / concepts.length;
    return {
      name: f,
      angle: angle,
      // @ts-ignore
      line_coord: angleToCoordinate(angle, maxRatingValue * 1.1),
      // @ts-ignore
      label_coord: angleToCoordinate(angle, maxRatingValue * 1.3),
    };
  });

  // Draw the axis lines.
  svg
    .selectAll("line")
    .data(featureData)
    .join((enter) =>
      enter
        .append("line")
        .attr("x1", width / 2)
        .attr("y1", height / 2)
        .attr("x2", (d) => d.line_coord.x)
        .attr("y2", (d) => d.line_coord.y)
        .attr("stroke", "black")
    );

  // Draw the axis labels.
  svg
    .selectAll(".axislabel")
    .data(featureData)
    .join((enter) =>
      enter
        .append("text")
        .attr("x", (d) => d.label_coord.x - 29)
        .attr("y", (d) => d.label_coord.y + 8)
        .text((d) => d.name)
    );

  /**
   * Data visualization.
   */
  // Create the spider chart line data.
  const line = d3
    .line()
    // @ts-ignore
    .x((d) => d.x)
    // @ts-ignore
    .y((d) => d.y)
    .curve(d3.curveLinearClosed);

  /**
   * Calculates the coordinates per data point.
   * @param {object} data_point
   * @returns {{x: number, y: number}[]} - The coordinates of the data point.
   */
  function getPathCoordinates(data_point) {
    const coordinates = concepts.map((concept, index) => {
      const angle = Math.PI / 2 + (2 * Math.PI * index) / concepts.length;
      // @ts-ignore
      return angleToCoordinate(angle, data_point[concept]);
    });
    return coordinates;
  }

  // Draw the spider chart data lines.
  svg
    .selectAll("path")
    .data([data])
    // @ts-ignore
    .join((enter) =>
      enter
        .append("path")
        .datum((d) => getPathCoordinates(d))
        // @ts-ignore
        .attr("d", line)
        .attr("stroke-width", 2)
        .attr("stroke", color)
        .attr("fill", color)
        .attr("stroke-opacity", 0.6)
        .attr("fill-opacity", 0.25)
    );

  // Draw circles at every data point and add a tooltip.
  svg
    .selectAll("circle.data-point")
    .data([data])
    .join("g") // Create a group for each data point
    .selectAll("circle")
    .data((d, i) =>
      getPathCoordinates(d).map((coord, i) => ({
        ...coord,
        concept: concepts[i],
        // @ts-ignore
        value: d[concepts[i]],
      }))
    )
    .join("circle")
    .attr("class", "data-point")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", 3)
    .attr("fill", color)
    .attr("stroke", color)
    .attr("stroke-width", 1)
    .attr("opacity", 0.6)
    .on("mouseover", (event, d) =>
      showTooltip(tooltip, event, setTooltip(d.concept, d.value))
    )
    .on("mouseout", () => hideTooltip(tooltip));

  /**
   * Title.
   */
  // Render the title of the diagram.
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", marginTop)
    .attr("text-anchor", "middle")
    .style("text-decoration", "underline")
    .text(title)
    .attr("font-family", "Georgia");
}
