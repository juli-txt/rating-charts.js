import * as d3 from "d3";
import {
  getTooltip,
  hideTooltip,
  showTooltip,
  formatNumber,
} from "../../utils";

/**
 * Renders a spider graph.
 *
 * @param {object[]} data - The rating data to be displayed in the graph. Contains the values for multiple concepts.
 * @property {string} data[].key - The key to the rating data.
 * @property {number} data[].value - The value of the rating data.
 * @param {number} minValue - The minimum value of the rating scale.
 * @param {object} options - The options for the graph.
 * @param {string} options.selector - The selector to render the graph in a div.
 * @param {string=} options.color - The color of the graph.
 * @param {object} options.margins - The margins of the graph.
 * @param {number=} options.margins.marginBottom - The bottom margin of the graph.
 * @param {number=} options.margins.marginLeft - The left margin of the graph.
 * @param {number=} options.margins.marginRight - The right margin of the graph.
 * @param {number=} options.margins.marginTop - The top margin of the graph.
 * @param {(_concept: string, _value: number) => string=} options.setTooltip - The function to set the tooltip for the values.
 * @param {object} options.size - The size of the graph.
 * @param {number=} options.size.height - The height of the graph.
 * @param {number=} options.size.width - The width of the graph.
 * @param {string=} options.title - The general title of the graph.
 * @returns {void} - The spider graph is rendered in the DOM.
 */
export function SpiderGraph(data, minValue, options) {
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
  // @ts-ignore
  const maxRatingValue = d3.max(concepts, (concept) => data[concept]);

  // Calculate the innerWidth and innerHeight with the margins.
  const innerWidth = width - marginLeft - marginRight;
  const innerHeight = height - marginTop - marginBottom;

  // Scale the chart.
  const scale = d3
    .scaleLinear()
    .domain([minValue, maxRatingValue])
    .range([0, Math.min(innerWidth, innerHeight) / 3]);

  // Thresholds for the ticks.
  const ticks = d3
    .range(0, 6)
    .map((i) => minValue + (i / 5) * (maxRatingValue - minValue));

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
      line_coord: angleToCoordinate(angle, maxRatingValue * 1.1),
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
