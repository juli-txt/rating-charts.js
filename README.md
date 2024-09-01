# rating-charts.js

This is a strongly typed JavaScript package for visualizing rating systems like Elo.
It can be used in educational or gamified dashboards as well as in pure gaming applications.
The package is based on D3, so all charts are rendered as SVG.

Currently the package contains the following visualizations:

- Histogram
- Line graph
- Spider graph
- Table
- Display of rating value, deviation and trend of both

You can find the project on [GitHub](https://classic.yarnpkg.com/en/package/react-rating-charts),
[npm](https://www.npmjs.com/package/rating-charts.js?activeTab=readme) or [yarn](https://yarnpkg.com/package?q=RatingCharts.&name=rating-charts.js)

There is also an implementation for usage in React: [react-rating-charts](https://www.npmjs.com/package/react-rating-charts?activeTab=readme)

## Usage

All charts can be imported like this:

```js
import { Table } from "rating-charts.js";
```

This `Table` can now be used as an SVG element.

## Building

To build the project, first clone the repository.
Then you can use the `yarn build` command to create a `dist`-folder containing the build.

## Testing

The whole project is tested to have 100% coverage of statements, branches, functions and lines.
If you want to test the package yourself, you can call `yarn test` in the console.
