import * as d3 from 'd3'
import { getTooltip, hideTooltip, showTooltip } from '../../Charts/tooltip'

describe('tooltip', () => {
    test('Tooltip', () => {
        document.body.innerHTML = '<div id="test"></div>'
        const container = document.querySelector('#test')
        const tooltip = getTooltip(d3.select(container))

        expect(tooltip).toBeTruthy()

        const event = { pageX: 100, pageY: 100 }

        showTooltip(tooltip, event, '')
        showTooltip(tooltip, event, 'test')

        const div = container.querySelector('div')
        expect(getComputedStyle(div).opacity).toBe('1')

        hideTooltip(tooltip)

        expect(getComputedStyle(div).opacity).toBe('0')
    })
})
