import { Histogram } from "../../src/charts";

describe("Histogram", () => {
  const data = [0, 0, 5, 10, 15, 20, 20];
  const minRatingValue = 0;
  const userRatingValue = 15;

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
    setUserInfoTooltip: (_value, _percentage) => "test",
    setXAxisTooltip: (_minValue, _maxValue) => "test",
    setYAxisTooltip: (_minValue, _maxValue) => "test",
  };

  test("Defined input", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');
    const color = "red";
    const setUserInfo = (_value, _percentage) => "test";

    Histogram(data, minRatingValue, userRatingValue, {
      selector: "#test",
      color: color,
      setUserInfo: setUserInfo,
      margins: margins,
      size: size,
      titles: titles,
      tooltips: tooltips,
    });

    expect(diagram).toBeTruthy();
  });

  test("Defined input and more than 10 of the same values", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');
    const color = "red";
    const setUserInfo = (_value, _percentage) => "test";
    const data = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    Histogram(data, minRatingValue, userRatingValue, {
      selector: "#test",
      color: color,
      setUserInfo: setUserInfo,
      margins: margins,
      size: size,
      titles: titles,
      tooltips: tooltips,
    });

    expect(diagram).toBeTruthy();
  });

  test("Empty input", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    Histogram(data, minRatingValue, userRatingValue, {
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

    Histogram(data, minRatingValue, userRatingValue, {
      selector: "#test",
    });

    expect(diagram).toBeTruthy();
  });

  test("Tooltips", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    Histogram(data, minRatingValue, userRatingValue, {
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

    const mouseOutEvent = new MouseEvent("mouseout", {
      bubbles: true,
      cancelable: true,
      view: window,
      pageX: 50,
      pageY: 50,
    });

    xAxis.dispatchEvent(mouseOutEvent);

    // y-axis tooltip.
    const yAxis = container.querySelector(".y-axis");
    yAxis.dispatchEvent(mouseOverEvent);
    yAxis.dispatchEvent(mouseOutEvent);

    // User info tooltip.
    const userInfo = container.querySelector(".user-info");
    userInfo.dispatchEvent(mouseOverEvent);
    userInfo.dispatchEvent(mouseOutEvent);
  });

  test("Undefined tooltips", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    Histogram(data, minRatingValue, userRatingValue, {
      selector: "#test",
      margins: margins,
      size: size,
      titles: {},
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
    console.log(getComputedStyle(tooltip).opacity);

    const mouseOutEvent = new MouseEvent("mouseout", {
      bubbles: true,
      cancelable: true,
      view: window,
      pageX: 50,
      pageY: 50,
    });

    xAxis.dispatchEvent(mouseOutEvent);

    // y-axis tooltip.
    const yAxis = container.querySelector(".y-axis");
    yAxis.dispatchEvent(mouseOverEvent);
    yAxis.dispatchEvent(mouseOutEvent);

    // User info tooltip.
    const userInfo = container.querySelector(".user-info");
    userInfo.dispatchEvent(mouseOverEvent);
    userInfo.dispatchEvent(mouseOutEvent);
  });

  test("UserInfo at end", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    Histogram(data, minRatingValue, 0, {
      selector: "#test",
    });

    expect(diagram).toBeTruthy();
  });

  test("UserInfo multiline", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    Histogram(data, minRatingValue, userRatingValue, {
      selector: "#test",
      setUserInfo: (_value, _percentage) => "test\ntest",
    });

    expect(diagram).toBeTruthy();
  });
});
