import { lineGraph } from '../../Charts'
import { fireEvent } from '@testing-library/dom'

describe('lineGraph', () => {
    const data = [
        { value: 1, deviation: 1, timestamp: new Date('2023-01-02') },
        { value: 2, deviation: 2, timestamp: new Date('2023-01-03') },
        { value: 1, timestamp: new Date('2023-01-04') }
    ]

    const minRatingValue = 0

    const margins = {
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0
    }

    const size = {
        width: 100,
        height: 100
    }

    const titles = {
        title: 'test',
        xAxisTitle: 'test',
        yAxisTitle: 'test'
    }

    const tooltips = {
        setAreaTooltip: () => 'test',
        setDataTooltip: (_value, _deviation, _timestamp) => 'test',
        setLowerDeviationTooltip: (_value, _timestmap) => 'test',
        setUpperDeviationTooltip: (_value, _timestmap) => 'test',
        setXAxisTooltip: (_minValue, _maxValue) => 'test',
        setYAxisTooltip: (_minValue, _maxValue) => 'test'
    }

    test('Defined input', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')
        const color = 'red'

        lineGraph(data, minRatingValue, {
            selector: '#test',
            color: color,
            margins: margins,
            size: size,
            titles: titles,
            tooltips: tooltips
        })

        expect(diagram).toBeTruthy()
    })

    test('Empty input', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        lineGraph(data, minRatingValue, {
            selector: '#test',
            margins: {},
            size: {},
            titles: {},
            tooltips: {}
        })

        expect(diagram).toBeTruthy()
    })

    test('Undefined input', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        lineGraph(data, minRatingValue, {
            selector: '#test'
        })

        expect(diagram).toBeTruthy()
    })

    test('Tooltips', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        lineGraph(data, minRatingValue, {
            selector: '#test',
            margins: margins,
            size: size,
            titles: titles,
            tooltips: tooltips
        })

        expect(diagram).toBeTruthy()

        const container = document.querySelector('#test')
        const tooltip = container.querySelector('div')

        // x-axis tooltip.
        const xAxis = container.querySelector('.x-axis')
        fireEvent.mouseOver(xAxis, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('1')

        fireEvent.mouseOut(xAxis, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // y-axis tooltip.
        const yAxis = container.querySelector('.y-axis')
        fireEvent.mouseOver(yAxis, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('1')

        fireEvent.mouseOut(yAxis, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // Area tooltip.
        const area = container.querySelector('.area')
        fireEvent.mouseOver(area, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('1')

        fireEvent.mouseOut(area, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // Data point tooltip.
        const dataPoint = container.querySelector('.data-point')
        fireEvent.mouseOver(dataPoint, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('1')

        fireEvent.mouseOut(dataPoint, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // Upper deviation tooltip.
        const upperDeviation = container.querySelector('.upper-deviation')
        fireEvent.mouseOver(upperDeviation, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('1')

        fireEvent.mouseOut(upperDeviation, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // Lower deviation tooltip.
        const lowerDeviation = container.querySelector('.lower-deviation')
        fireEvent.mouseOver(lowerDeviation, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('1')

        fireEvent.mouseOut(lowerDeviation, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')
    })

    test('Undefined tooltips', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        lineGraph(data, minRatingValue, {
            selector: '#test',
            margins: margins,
            size: size,
            titles: titles,
            tooltips: {}
        })

        expect(diagram).toBeTruthy()

        const container = document.querySelector('#test')
        const tooltip = container.querySelector('div')

        // x-axis tooltip.
        const xAxis = container.querySelector('.x-axis')
        fireEvent.mouseOver(xAxis, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        fireEvent.mouseOut(xAxis, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // y-axis tooltip.
        const yAxis = container.querySelector('.y-axis')
        fireEvent.mouseOver(yAxis, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        fireEvent.mouseOut(yAxis, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // Area tooltip.
        const area = container.querySelector('.area')
        fireEvent.mouseOver(area, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        fireEvent.mouseOut(area, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // Data point tooltip.
        const dataPoint = container.querySelector('.data-point')
        fireEvent.mouseOver(dataPoint, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        fireEvent.mouseOut(dataPoint, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // Upper deviation tooltip.
        const upperDeviation = container.querySelector('.upper-deviation')
        fireEvent.mouseOver(upperDeviation, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        fireEvent.mouseOut(upperDeviation, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // Lower deviation tooltip.
        const lowerDeviation = container.querySelector('.lower-deviation')
        fireEvent.mouseOver(lowerDeviation, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        fireEvent.mouseOut(lowerDeviation, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')
    })
})
