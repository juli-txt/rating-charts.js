import { LineGraph } from "../../src/charts";

describe("LineGraph", () => {
  const data = [
    { value: 1, deviation: 1, timestamp: new Date("2023-01-02") },
    { value: 2, deviation: 2, timestamp: new Date("2023-01-03") },
    { value: 1, timestamp: new Date("2023-01-04") },
  ];

  const minRatingValue = 0;

  const margins = {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  };

  const size = {
    width: 100,
    height: 100,
  };

  const titles = {
    title: "test",
    xAxisTitle: "test",
    yAxisTitle: "test",
  };

  const tooltips = {
    setAreaTooltip: () => "test",
    setDataTooltip: (_value, _deviation, _timestamp) => "test",
    setLowerDeviationTooltip: (_value, _timestmap) => "test",
    setUpperDeviationTooltip: (_value, _timestmap) => "test",
    setXAxisTooltip: (_minValue, _maxValue) => "test",
    setYAxisTooltip: (_minValue, _maxValue) => "test",
  };

  test("Defined input", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');
    const color = "red";

    LineGraph(data, minRatingValue, {
      selector: "#test",
      color: color,
      margins: margins,
      size: size,
      titles: titles,
      tooltips: tooltips,
    });

    expect(diagram).toBeTruthy();
  });

  test("Empty input", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    LineGraph(data, minRatingValue, {
      selector: "#test",
      margins: {},
      size: {},
      titles: {},
      tooltips: {},
    });

    expect(diagram).toBeTruthy();
  });

  test("Undefined input", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    LineGraph(data, minRatingValue, {
      selector: "#test",
    });

    expect(diagram).toBeTruthy();
  });

  test("Tooltips", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    LineGraph(data, minRatingValue, {
      selector: "#test",
      margins: margins,
      size: size,
      titles: titles,
      tooltips: tooltips,
    });

    expect(diagram).toBeTruthy();

    const container = document.querySelector("#test");
    const tooltip = container.querySelector("div");

    // x-axis tooltip.
    const xAxis = container.querySelector(".x-axis");
    const mouseOverEvent = new MouseEvent("mouseover", {
      bubbles: true,
      cancelable: true,
      view: window,
      pageX: 50,
      pageY: 50,
    });

    xAxis.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("1");

    const mouseOutEvent = new MouseEvent("mouseout", {
      bubbles: true,
      cancelable: true,
      view: window,
      pageX: 50,
      pageY: 50,
    });

    xAxis.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // y-axis tooltip.
    const yAxis = container.querySelector(".y-axis");
    yAxis.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("1");

    yAxis.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // Area tooltip.
    const area = container.querySelector(".area");
    area.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("1");

    area.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // Data point tooltip.
    const dataPoint = container.querySelector(".data-point");
    dataPoint.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("1");

    dataPoint.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // Upper deviation tooltip.
    const upperDeviation = container.querySelector(".upper-deviation");
    upperDeviation.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("1");

    upperDeviation.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // Lower deviation tooltip.
    const lowerDeviation = container.querySelector(".lower-deviation");
    lowerDeviation.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("1");

    lowerDeviation.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");
  });

  test("Undefined tooltips", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    LineGraph(data, minRatingValue, {
      selector: "#test",
      margins: margins,
      size: size,
      titles: titles,
      tooltips: {},
    });

    expect(diagram).toBeTruthy();

    const container = document.querySelector("#test");
    const tooltip = container.querySelector("div");

    // x-axis tooltip.
    const xAxis = container.querySelector(".x-axis");
    const mouseOverEvent = new MouseEvent("mouseover", {
      bubbles: true,
      cancelable: true,
      view: window,
      pageX: 50,
      pageY: 50,
    });

    xAxis.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    const mouseOutEvent = new MouseEvent("mouseout", {
      bubbles: true,
      cancelable: true,
      view: window,
      pageX: 50,
      pageY: 50,
    });

    xAxis.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // y-axis tooltip.
    const yAxis = container.querySelector(".y-axis");
    yAxis.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    yAxis.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // Area tooltip.
    const area = container.querySelector(".area");
    area.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    area.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // Data point tooltip.
    const dataPoint = container.querySelector(".data-point");
    dataPoint.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    dataPoint.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // Upper deviation tooltip.
    const upperDeviation = container.querySelector(".upper-deviation");
    upperDeviation.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    upperDeviation.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // Lower deviation tooltip.
    const lowerDeviation = container.querySelector(".lower-deviation");
    lowerDeviation.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    lowerDeviation.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");
  });
});
