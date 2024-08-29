import { table } from '../../Charts'
import { fireEvent } from '@testing-library/dom'

describe('table', () => {
    const data = [
        { value: 1, deviation: 1, timestamp: new Date('2023-01-02') },
        { value: 2, deviation: 2, timestamp: new Date('2023-01-03') },
        { value: 1, timestamp: new Date('2023-01-04') }
    ]

    const columns = [
        { key: 'value', header: 'Value' },
        { key: 'deviation', header: 'Deviation' },
        { key: 'timestamp', header: 'Timestamp' }
    ]

    const marginTop = 0
    const setHeaderTooltip = (_column) => 'test'
    const title = 'test'

    const size = {
        maxWidth: 100,
        maxHeight: 100,
        minWidth: 0,
        minHeight: 0
    }

    test('Defined input', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')
        const color = 'red'
        const setRGBColor = (_alpha) => '#000000'

        table(data, columns, {
            selector: '#test',
            color: color,
            marginTop: marginTop,
            setHeaderTooltip: setHeaderTooltip,
            setRGBColor: setRGBColor,
            size: size,
            title: title
        })

        expect(diagram).toBeTruthy()
    })

    test('Empty input', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        table(data, columns, {
            selector: '#test',
            size: {}
        })

        expect(diagram).toBeTruthy()
    })

    test('Undefined input', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        table(data, columns, {
            selector: '#test'
        })

        expect(diagram).toBeTruthy()
    })

    test('Tooltip', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        table(data, columns, {
            selector: '#test',
            marginTop: marginTop,
            setHeaderTooltip: setHeaderTooltip,
            size: size,
            title: title
        })

        expect(diagram).toBeTruthy()

        const container = document.querySelector('#test')
        const tooltip = container.querySelector('div')

        // Header tooltip.
        const header = container.querySelector('.header')
        fireEvent.mouseOver(header, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('1')

        fireEvent.mouseOut(header, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')
    })

    test('Undefined input', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        table(data, columns, {
            selector: '#test'
        })

        expect(diagram).toBeTruthy()
    })

    test('Undefined tooltip', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        table(data, columns, {
            selector: '#test',
            marginTop: marginTop,
            size: size,
            title: title
        })

        expect(diagram).toBeTruthy()

        const container = document.querySelector('#test')
        const tooltip = container.querySelector('div')

        // Header tooltip.
        const header = container.querySelector('.header')
        fireEvent.mouseOver(header, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        fireEvent.mouseOut(header, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')
    })
})
