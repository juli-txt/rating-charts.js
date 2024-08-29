import { Rating } from "../../src/charts";

describe("Rating", () => {
  beforeEach(() => {
    SVGElement.prototype.getComputedTextLength = () => 10;
  });

  const data = {
    ratingValue: 1,
    ratingValueTrend: 1,
    ratingDeviation: 1,
    ratingDeviationTrend: 1,
    maxRatingDeviation: 10,
  };

  const title = "test";

  const tooltips = {
    setDeviationTooltip: (_deviation) => "test",
    setDeviationTrendTooltip: (_deviationTrend) => "test",
    setValueTooltip: (_value) => "test",
    setValueTrendTooltip: (_valueTrend) => "test",
  };

  const width = 100;

  test("Defined input", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    Rating(data, {
      selector: "#test",
      title: title,
      tooltips: tooltips,
      width: width,
    });

    expect(diagram).toBeTruthy();
  });

  test("Empty input", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    Rating(data, {
      selector: "#test",
      tooltips: {},
    });

    expect(diagram).toBeTruthy();
  });

  test("Undefined input", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    Rating(data, {
      selector: "#test",
    });

    expect(diagram).toBeTruthy();
  });

  test("Tooltips", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    Rating(data, {
      selector: "#test",
      title: title,
      tooltips: tooltips,
      width: width,
    });

    expect(diagram).toBeTruthy();

    const container = document.querySelector("#test");
    const tooltip = container.querySelector("div");

    // Rating value tooltip.
    const value = container.querySelector(".value");
    const mouseOverEvent = new MouseEvent("mouseover", {
      bubbles: true,
      cancelable: true,
      view: window,
      pageX: 50,
      pageY: 50,
    });

    value.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("1");

    const mouseOutEvent = new MouseEvent("mouseout", {
      bubbles: true,
      cancelable: true,
      view: window,
      pageX: 50,
      pageY: 50,
    });

    value.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // Rating value trend tooltip.
    const valueTrend = container.querySelector(".value-trend");
    valueTrend.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("1");

    valueTrend.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // Rating deviation tooltip.
    const deviation = container.querySelector(".deviation");
    deviation.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("1");

    deviation.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // Rating deviation trend tooltip.
    const deviationTrend = container.querySelector(".deviation-trend");
    deviationTrend.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("1");

    deviationTrend.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");
  });

  test("Undefined tooltips", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    Rating(data, {
      selector: "#test",
      title: title,
      width: width,
    });

    expect(diagram).toBeTruthy();

    const container = document.querySelector("#test");
    const tooltip = container.querySelector("div");

    // Rating value tooltip.
    const value = container.querySelector(".value");
    const mouseOverEvent = new MouseEvent("mouseover", {
      bubbles: true,
      cancelable: true,
      view: window,
      pageX: 50,
      pageY: 50,
    });

    value.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    const mouseOutEvent = new MouseEvent("mouseout", {
      bubbles: true,
      cancelable: true,
      view: window,
      pageX: 50,
      pageY: 50,
    });

    value.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // Rating value trend tooltip.
    const valueTrend = container.querySelector(".value-trend");

    valueTrend.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    valueTrend.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // Rating deviation tooltip.
    const deviation = container.querySelector(".deviation");

    deviation.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    deviation.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    // Rating deviation trend tooltip.
    const deviationTrend = container.querySelector(".deviation-trend");

    deviationTrend.dispatchEvent(mouseOverEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");

    deviationTrend.dispatchEvent(mouseOutEvent);
    expect(getComputedStyle(tooltip).opacity).toBe("0");
  });

  test("Reverse trend icons", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    Rating(
      {
        ratingValue: data.ratingValue,
        ratingValueTrend: -data.ratingValueTrend,
        ratingDeviation: data.ratingDeviation,
        ratingDeviationTrend: -data.ratingDeviationTrend,
        maxRatingDeviation: data.maxRatingDeviation,
      },
      {
        selector: "#test",
        title: title,
        tooltips: tooltips,
        width: width,
      }
    );

    expect(diagram).toBeTruthy();
  });

  test("No rating deviation", () => {
    const diagram = (document.body.innerHTML = '<div id="test"></div>');

    Rating(
      {
        ratingValue: data.ratingValue,
        ratingValueTrend: data.ratingValueTrend,
      },
      {
        selector: "#test",
        title: title,
        tooltips: tooltips,
        width: width,
      }
    );

    expect(diagram).toBeTruthy();
  });
});
