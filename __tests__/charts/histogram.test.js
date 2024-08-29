import { histogram } from '../../Charts'
import { fireEvent } from '@testing-library/dom'

describe('histogram', () => {
    const data = [0, 0, 5, 10, 15, 20, 20]
    const minRatingValue = 0
    const userRatingValue = 15

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
        setUserInfoTooltip: (_value, _percentage) => 'test',
        setXAxisTooltip: (_minValue, _maxValue) => 'test',
        setYAxisTooltip: (_minValue, _maxValue) => 'test'
    }

    test('Defined input', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')
        const color = 'red'
        const setUserInfo = (_value, _percentage) => 'test'

        histogram(data, minRatingValue, userRatingValue, {
            selector: '#test',
            color: color,
            setUserInfo: setUserInfo,
            margins: margins,
            size: size,
            titles: titles,
            tooltips: tooltips
        })

        expect(diagram).toBeTruthy()
    })

    test('Empty input', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        histogram(data, minRatingValue, userRatingValue, {
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

        histogram(data, minRatingValue, userRatingValue, {
            selector: '#test'
        })

        expect(diagram).toBeTruthy()
    })

    test('Tooltips', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        histogram(data, minRatingValue, userRatingValue, {
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

        // User info tooltip.
        const userInfo = container.querySelector('.user-info')
        fireEvent.mouseOver(userInfo, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('1')

        fireEvent.mouseOut(userInfo, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')
    })

    test('Undefined tooltips', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        histogram(data, minRatingValue, userRatingValue, {
            selector: '#test',
            margins: margins,
            size: size,
            titles: {},
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

        // User info tooltip.
        const userInfo = container.querySelector('.user-info')
        fireEvent.mouseOver(userInfo, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')

        fireEvent.mouseOut(userInfo, {
            pageX: 50,
            pageY: 50
        })
        expect(getComputedStyle(tooltip).opacity).toBe('0')
    })

    test('UserInfo at end', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        histogram(data, minRatingValue, 0, {
            selector: '#test'
        })

        expect(diagram).toBeTruthy()
    })

    test('UserInfo multiline', () => {
        const diagram = (document.body.innerHTML = '<div id="test"></div>')

        histogram(data, minRatingValue, userRatingValue, {
            selector: '#test',
            setUserInfo: (_value, _percentage) => 'test\ntest'
        })

        expect(diagram).toBeTruthy()
    })
})
