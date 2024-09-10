import * as d3 from "d3";
import {
  formatNumber,
  getDeviationColorValue,
  getSign,
  getTextWidth,
} from "../../src/utils";

describe("Utils", () => {
  describe("formatNumber", () => {
    test("Empty input", () => {
      expect(formatNumber()).toBe("");
      expect(formatNumber(undefined, 1)).toBe("");
      expect(formatNumber(null, 1)).toBe("");
    });

    test("Positive decimals", () => {
      expect(formatNumber(123.4, 3)).toBe("123");
      expect(formatNumber(123.4, 4)).toBe("123.4");
      expect(formatNumber(123.4, 5)).toBe("123.40");
      expect(formatNumber(123.4567, 6)).toBe("123.456");
      expect(formatNumber(12345.67, 4)).toBe("12e3");
    });

    test("Positive integers", () => {
      expect(formatNumber(1234, 3)).toBe("1e3");
      expect(formatNumber(1234, 4)).toBe("1234");
      expect(formatNumber(1234, 5)).toBe("1234.0");
    });

    test("Negative decimals", () => {
      expect(formatNumber(-123.4, 3)).toBe("-123");
      expect(formatNumber(-123.4, 4)).toBe("-123.4");
      expect(formatNumber(-123.4, 5)).toBe("-123.40");
    });

    test("Negative integers", () => {
      expect(formatNumber(-1234, 3)).toBe("-1e3");
      expect(formatNumber(-1234, 4)).toBe("-1234");
      expect(formatNumber(-1234, 5)).toBe("-1234.0");
    });
  });

  describe("getSign", () => {
    test("Negative", () => {
      expect(getSign(-5)).toBe("-");
    });

    test("Non-negative", () => {
      expect(getSign(0)).toBe("");
      expect(getSign(5)).toBe("");
    });
  });

  describe("getTextWidth", () => {
    beforeEach(() => {
      SVGElement.prototype.getComputedTextLength = () => 10;
    });

    test("calculates text width", () => {
      document.body.innerHTML = '<svg id="test"></svg>';
      const svg = d3.select("#test");
      const width = getTextWidth(svg, "test", "16");

      expect(width).toBe(10);
    });
  });

  describe("getDeviationColorValue", () => {
    test("maxDeviation is 0", () => {
      expect(getDeviationColorValue(5, 0)).toBe(0);
    });

    test("Correct color calculations", () => {
      expect(getDeviationColorValue(-2, 10)).toBe(217.6);
      expect(getDeviationColorValue(0, 10)).toBe(192);
      expect(getDeviationColorValue(5, 10)).toBe(128);
      expect(getDeviationColorValue(10, 10)).toBe(64);
      expect(getDeviationColorValue(15, 10)).toBe(0);
    });
  });
});
