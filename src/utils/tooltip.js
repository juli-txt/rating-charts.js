/**
 * Create a div for the tooltip and hide it initially.
 *
 * @param {Selection} container - The SVG container to append the tooltip to.
 * @returns {Selection} - The tooltip div.
 */
function getTooltip(container) {
  return (
    container
      // @ts-ignore
      .append("div")
      .style("font-family", "Georgia")
      .style("position", "absolute")
      .style("background", "white")
      .style("padding-left", "5px")
      .style("padding-right", "5px")
      .style("border-radius", "5px")
      .style("border", "1px solid black")
      .style("pointer-events", "none")
      .style("opacity", 0)
  );
}

/**
 * Function to show tooltip.
 *
 * @param {Selection} tooltip
 * @param {*} event
 * @param {string} text
 * @returns {void} - Shows the tooltip.
 */
function showTooltip(tooltip, event, text) {
  if (text != "") {
    tooltip
      // @ts-ignore
      .style("left", event.pageX + "px")
      .style("top", event.pageY + "px")
      .style("opacity", 1)
      .text(text);
  }
}

/**
 * Function to hide tooltip.
 *
 * @param {Selection} tooltip - The tooltip to hide.
 * @returns {void} - Hides the tooltip.
 */
function hideTooltip(tooltip) {
  // @ts-ignore
  tooltip.style("opacity", 0);
}

export { getTooltip, showTooltip, hideTooltip };
