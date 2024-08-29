import * as d3 from "d3";
import { getTooltip, hideTooltip, showTooltip } from "../../utils";

/**
 * @typedef {object} TableDataProps
 * @property {number} value - The rating value to be displayed in the table.
 * @property {number | null} deviation - The rating deviation to be displayed in the table.
 * @property {Date}timestamp - The timestamp of the rating to be displayed in the table.
 */

/**
 * @typedef {object} TableColumnProps
 * @property {"timestamp" | "value" | "deviation"} key - The key of the column.
 * @property {string} header - The header of the column.
 */

/**
 * @typedef {object} TableOptions
 * @property {string} selector - The selector to render the table in a div.
 * @property {number=} marginTop - The top margin of the table.
 * @property {(_header: string) => string=} setHeaderTooltip - The function to set the tooltip for the column headers.
 * @property {(alpha: number) => string=}setRGBColor - The function to set the color of the table.
 * @property {object} size - The size of the table.
 * @property {number=} size.maxHeight - The maximum height of the table.
 * @property {number=} size.maxWidth - The maximum width of the table.
 * @property {number=} size.minHeight - The minimum height of the table.
 * @property {number=} size.minWidth - The minimum width of the table.
 * @property {string=} title - The general title for the table.
 */

/**
 * Renders a table.
 *
 * @param {Array<TableDataProps>} data - The rating data to be displayed in the table. Contains the timestamp, value and deviation.
 * @param {Array<TableColumnProps>} columns - The columns of the table.
 * @param {TableOptions} options - The options for the table.
 * @returns {void} - The table is rendered in the DOM.
 */
export function Table(data, columns, options) {
  /**
   * Parameters.
   */
  // Destructure the parameters and initialize them with default values.
  const {
    selector,
    marginTop = 10,
    setHeaderTooltip = (_header) => "",
    setRGBColor = (alpha) => `rgba(0, 0, 128, ${alpha})`,
    size: { maxHeight = 400, maxWidth = 700, minHeight = 0, minWidth = 0 } = {},
    title = "",
  } = options;

  /**
   * SVG container.
   */
  // Clear the container.
  const container = d3.select(selector);
  container.selectAll("*").remove();

  // Create the tooltip.
  // @ts-ignore
  const tooltip = getTooltip(container);

  /**
   * Title.
   */
  // Render the title of the diagram.
  container
    .append("text")
    .attr("text-anchor", "middle")
    .style("text-decoration", "underline")
    .text(title)
    .style("font-family", "Georgia");

  /**
   * Table.
   */
  // Create a div to wrap the table and make it scrollable.
  const scrollableDiv = container
    .append("div")
    .style("max-height", `${maxHeight}px`)
    .style("padding-right", "17px")
    .style("overflow-y", "auto")
    .style("max-width", `${maxWidth}px`)
    .style("overflow-x", "auto")
    .style("margin-top", `${marginTop}px`);

  // Create a table element.
  const table = scrollableDiv
    .append("table")
    .style("border-collapse", "collapse")
    .style("font-size", "18px")
    .style("font-family", "Georgia")
    .style("min-width", `${minWidth}px`)
    .style("min-height", `${minHeight}px`);

  /**
   * Data visualization.
   */
  // Create the header.
  const thead = table.append("thead");
  thead
    .append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .attr("class", "header")
    .text((d) => d.header)
    .style("padding-left", "10px")
    .style("padding-right", "10px")
    .style("padding-top", "10px")
    .style("padding-bottom", "10px")
    .style("border-style", "solid")
    .style("border-width", "1px")
    .style("border-color", "white")
    .style("background-color", setRGBColor(1.0))
    .style("color", "white")
    .on("mouseover", (event, d) =>
      showTooltip(tooltip, event, setHeaderTooltip(d.header.toLowerCase()))
    )
    .on("mouseout", () => hideTooltip(tooltip));

  // Map the timestamps to ISO string.
  const mappedData = data
    .map((d) => ({
      timestamp: d.timestamp.toISOString(),
      value: d.value,
      deviation: d.deviation,
    }))
    .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));

  // Create the rows.
  const rows = table
    .append("tbody")
    .selectAll("tr")
    .data(mappedData)
    .enter()
    .append("tr");

  // Style the rows to have alternating colors.
  rows
    .attr("color", "black")
    .style("background-color", (_, i) =>
      i % 2 ? setRGBColor(0.15) : "rgba(0, 0, 0, 0.1)"
    );

  // Add the data to the rows.
  rows
    .selectAll("td")
    .data((d) => columns.map((column) => d[column.key]))
    .enter()
    .append("td")
    .text((d) => d)
    .style("padding-left", "10px")
    .style("padding-right", "10px")
    .style("padding-top", "5px")
    .style("padding-bottom", "5px")
    .style("border-style", "solid")
    .style("border-width", "1px")
    .style("border-color", "white");
}
