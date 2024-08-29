import { spiderGraph } from '../../Charts'
import { fireEvent } from '@testing-library/dom'

describe('spiderGraph', () => {
    const minValue = 0
    const data = {
        test1: 1,
        test2: 2,
        test3: 3,
        test4: 4
    }

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

    const setTooltip = (_concept, _value) => 'test'
    const title = 'test'

    test('Defined input', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')
        const color = 'red'

        spiderGraph(data, minValue, {
            selector: '#test',
            color: color,
            margins: margins,
            setTooltip: setTooltip,
            size: size,
            title: title
        })

        expect(diagram).toBeTruthy()
    })

    test('Empty input', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        spiderGraph(data, minValue, {
            selector: '#test',
            margins: {},
            size: {}
        })

        expect(diagram).toBeTruthy()
    })

    test('Undefined input', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        spiderGraph(data, minValue, {
            selector: '#test'
        })

        expect(diagram).toBeTruthy()
    })

    test('Tooltip', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        spiderGraph(data, minValue, {
            selector: '#test',
            margins: margins,
            setTooltip: setTooltip,
            size: size,
            title: title
        })

        expect(diagram).toBeTruthy()

        const container = document.querySelector('#test')
        const tooltip = container.querySelector('div')

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
    })

    test('Undefined tooltip', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        spiderGraph(data, minValue, {
            selector: '#test',
            margins: margins,
            size: size,
            title: title
        })

        expect(diagram).toBeTruthy()

        const container = document.querySelector('#test')
        const tooltip = container.querySelector('div')

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
    })
})
