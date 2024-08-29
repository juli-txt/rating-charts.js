import { rating } from '../../Charts'
import { fireEvent } from '@testing-library/dom'

describe('rating', () => {
    beforeEach(() => {
        SVGElement.prototype.getComputedTextLength = () => 10
    })

    const data = {
        ratingValue: 1,
        ratingValueTrend: 1,
        ratingDeviation: 1,
        ratingDeviationTrend: 1,
        maxRatingDeviation: 10
    }

    const title = 'test'

    const tooltips = {
        setDeviationTooltip: (_deviation) => 'test',
        setDeviationTrendTooltip: (_deviationTrend) => 'test',
        setValueTooltip: (_value) => 'test',
        setValueTrendTooltip: (_valueTrend) => 'test'
    }

    const width = 100

    test('Defined input', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        rating(data, {
            selector: '#test',
            title: title,
            tooltips: tooltips,
            width: width
        })

        expect(diagram).toBeTruthy()
    })

    test('Empty input', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        rating(data, {
            selector: '#test',
            tooltips: {}
        })

        expect(diagram).toBeTruthy()
    })

    test('Undefined input', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        rating(data, {
            selector: '#test'
        })

        expect(diagram).toBeTruthy()
    })

    test('Tooltips', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        rating(data, {
            selector: '#test',
            title: title,
            tooltips: tooltips,
            width: width
        })

        expect(diagram).toBeTruthy()

        const container = document.querySelector('#test')
        const tooltip = container.querySelector('div')

        // Rating value tooltip.
        const value = container.querySelector('.value')
        fireEvent.mouseOver(value, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('1')

        fireEvent.mouseOut(value, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // Rating value trend tooltip.
        const valueTrend = container.querySelector('.value-trend')
        fireEvent.mouseOver(valueTrend, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('1')

        fireEvent.mouseOut(valueTrend, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // Rating deviation tooltip.
        const deviation = container.querySelector('.deviation')
        fireEvent.mouseOver(deviation, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('1')

        fireEvent.mouseOut(deviation, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // Rating deviation trend tooltip.
        const deviationTrend = container.querySelector('.deviation-trend')
        fireEvent.mouseOver(deviationTrend, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('1')

        fireEvent.mouseOut(deviationTrend, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')
    })

    test('Undefined tooltips', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        rating(data, {
            selector: '#test',
            title: title,
            width: width
        })

        expect(diagram).toBeTruthy()

        const container = document.querySelector('#test')
        const tooltip = container.querySelector('div')

        // Rating value tooltip.
        const value = container.querySelector('.value')
        fireEvent.mouseOver(value, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        fireEvent.mouseOut(value, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // Rating value trend tooltip.
        const valueTrend = container.querySelector('.value-trend')
        fireEvent.mouseOver(valueTrend, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        fireEvent.mouseOut(valueTrend, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // Rating deviation tooltip.
        const deviation = container.querySelector('.deviation')
        fireEvent.mouseOver(deviation, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        fireEvent.mouseOut(deviation, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        // Rating deviation trend tooltip.
        const deviationTrend = container.querySelector('.deviation-trend')
        fireEvent.mouseOver(deviationTrend, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        fireEvent.mouseOut(deviationTrend, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')
    })

    test('Reverse trend icons', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        rating(
            {
                ratingValue: data.ratingValue,
                ratingValueTrend: -data.ratingValueTrend,
                ratingDeviation: data.ratingDeviation,
                ratingDeviationTrend: -data.ratingDeviationTrend,
                maxRatingDeviation: data.maxRatingDeviation
            },
            {
                selector: '#test',
                title: title,
                tooltips: tooltips,
                width: width
            }
        )

        expect(diagram).toBeTruthy()
    })

    test('No rating deviation', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        rating(
            {
                ratingValue: data.ratingValue,
                ratingValueTrend: data.ratingValueTrend
            },
            {
                selector: '#test',
                title: title,
                tooltips: tooltips,
                width: width
            }
        )

        expect(diagram).toBeTruthy()
    })
})
