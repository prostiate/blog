import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { percentageFromPointer } from '../../../utils/xray'
import ProjectXray from './ProjectXray.vue'
import projectXraySource from './ProjectXray.vue?raw'

function mountXray(mobile = false) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: query === '(max-width: 639px)' ? mobile : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }))
  )

  return mount(ProjectXray, {
    props: { label: 'OnoToolkit architecture reveal' },
    slots: { product: 'Product layer', architecture: 'Architecture layer' }
  })
}

function setStageBounds(stage: HTMLElement, left = 100, width = 400) {
  Object.defineProperty(stage, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ left, width })
  })
}

describe('ProjectXray', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('starts at a 70 percent product reveal', () => {
    expect(mountXray().get('[role="slider"]').attributes('aria-valuenow')).toBe('70')
  })

  it('supports explicit layer controls', async () => {
    const wrapper = mountXray()
    await wrapper.get('[data-layer="architecture"]').trigger('click')
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('0')
    await wrapper.get('[data-layer="product"]').trigger('click')
    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('100')
  })

  it('exposes which explicit endpoint is selected', async () => {
    const wrapper = mountXray()
    const product = wrapper.get('[data-layer="product"]')
    const architecture = wrapper.get('[data-layer="architecture"]')

    expect(product.attributes('aria-pressed')).toBe('false')
    expect(architecture.attributes('aria-pressed')).toBe('false')

    await architecture.trigger('click')
    expect(product.attributes('aria-pressed')).toBe('false')
    expect(architecture.attributes('aria-pressed')).toBe('true')

    await product.trigger('click')
    expect(product.attributes('aria-pressed')).toBe('true')
    expect(architecture.attributes('aria-pressed')).toBe('false')
  })

  it('supports slider keyboard controls', async () => {
    const wrapper = mountXray()
    const slider = wrapper.get('[role="slider"]')
    await slider.trigger('keydown', { key: 'ArrowLeft' })
    expect(slider.attributes('aria-valuenow')).toBe('65')
    await slider.trigger('keydown', { key: 'Home' })
    expect(slider.attributes('aria-valuenow')).toBe('0')
    await slider.trigger('keydown', { key: 'End' })
    expect(slider.attributes('aria-valuenow')).toBe('100')
  })

  it('keeps the focused slider treatment inside the handle bounds', () => {
    const componentDocument = new DOMParser().parseFromString(projectXraySource, 'text/html')
    const styleElement = document.createElement('style')
    styleElement.textContent = Array.from(componentDocument.querySelectorAll('style'))
      .map((style) => style.textContent)
      .join('\n')
    document.head.append(styleElement)

    const focusRule = Array.from(styleElement.sheet?.cssRules ?? []).find(
      (rule): rule is CSSStyleRule =>
        'selectorText' in rule && rule.selectorText === '.project-xray__handle:focus-visible'
    )

    try {
      expect(
        focusRule?.style
          .getPropertyValue('outline')
          .split(/\s+/)
          .every((value) => value === 'none')
      ).toBe(true)
      expect(focusRule?.style.getPropertyValue('box-shadow').split(/\s+/)).toContain('inset')
    } finally {
      styleElement.remove()
    }
  })

  it('clamps pointer positions to the visual bounds', () => {
    expect(percentageFromPointer(50, 100, 400)).toBe(0)
    expect(percentageFromPointer(300, 100, 400)).toBe(50)
    expect(percentageFromPointer(600, 100, 400)).toBe(100)
  })

  it('falls back to the full architecture layer when product media fails', async () => {
    const wrapper = mountXray()
    await wrapper.setProps({ productAvailable: false })
    const slider = wrapper.get('[role="slider"]')
    expect(slider.attributes('aria-valuenow')).toBe('0')
    expect(slider.attributes('aria-disabled')).toBe('true')
    expect(wrapper.get('[data-layer="product"]').attributes()).toHaveProperty('disabled')
  })

  it('prevents keyboard input from changing the architecture fallback', async () => {
    const wrapper = mountXray()
    await wrapper.setProps({ productAvailable: false })
    const slider = wrapper.get('[role="slider"]')

    await slider.trigger('keydown', { key: 'ArrowRight' })

    expect(slider.attributes('aria-valuenow')).toBe('0')
  })

  it('updates the reveal using the clamped stage pointer position', async () => {
    const wrapper = mountXray()
    const stage = wrapper.get('.project-xray__stage')
    setStageBounds(stage.element as HTMLElement)

    await stage.trigger('pointerdown', { clientX: 350, pointerId: 1 })

    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('63')
  })

  it('ignores stage pointer input and removes the reveal slider on mobile', async () => {
    const wrapper = mountXray(true)
    const stage = wrapper.get('.project-xray__stage')
    const element = stage.element as HTMLElement
    element.setPointerCapture = vi.fn()
    element.releasePointerCapture = vi.fn()
    setStageBounds(element)
    await nextTick()

    await stage.trigger('pointerdown', { clientX: 140, pointerId: 11 })
    await stage.trigger('pointermove', { clientX: 460, pointerId: 11 })
    await stage.trigger('pointerup', { pointerId: 11 })

    expect(wrapper.get('.project-xray__product').attributes('style')).toContain('30%')
    expect(wrapper.find('[role="slider"]').exists()).toBe(false)
  })

  it('keeps explicit mobile layer controls available without the slider', async () => {
    const wrapper = mountXray(true)
    await nextTick()

    await wrapper.get('[data-layer="architecture"]').trigger('click')
    expect(wrapper.get('.project-xray__product').attributes('style')).toContain('100%')
    await wrapper.get('[data-layer="product"]').trigger('click')
    expect(wrapper.get('.project-xray__product').attributes('style')).toContain('0%')
  })

  it('associates the named mobile control group with its updating reveal status', async () => {
    const wrapper = mountXray(true)
    await nextTick()
    const controls = wrapper.get('[role="group"][aria-label="Visual layer"]')
    const statusId = controls.attributes('aria-describedby')

    expect(statusId).toBeTruthy()
    expect(wrapper.get(`#${statusId}`).attributes('role')).toBe('status')
    expect(wrapper.get(`#${statusId}`).text()).toBe('70% product, 30% architecture')
    expect(wrapper.find('[role="slider"]').exists()).toBe(false)

    await wrapper.get('[data-layer="architecture"]').trigger('click')
    expect(wrapper.get(`#${statusId}`).text()).toBe('0% product, 100% architecture')

    await wrapper.get('[data-layer="product"]').trigger('click')
    expect(wrapper.get(`#${statusId}`).text()).toBe('100% product, 0% architecture')
  })

  it('releases pointer capture after pointer cancellation', async () => {
    const wrapper = mountXray()
    const stage = wrapper.get('.project-xray__stage')
    const element = stage.element as HTMLElement
    const setPointerCapture = vi.fn()
    const releasePointerCapture = vi.fn()
    element.setPointerCapture = setPointerCapture
    element.releasePointerCapture = releasePointerCapture
    setStageBounds(element)

    await stage.trigger('pointerdown', { clientX: 200, pointerId: 7 })
    await stage.trigger('pointercancel', { pointerId: 7 })

    expect(setPointerCapture).toHaveBeenCalledWith(7)
    expect(releasePointerCapture).toHaveBeenCalledWith(7)
  })

  it('updates active drags and releases capture on pointer completion', async () => {
    const wrapper = mountXray()
    const stage = wrapper.get('.project-xray__stage')
    const element = stage.element as HTMLElement
    const releasePointerCapture = vi.fn()
    element.setPointerCapture = vi.fn()
    element.releasePointerCapture = releasePointerCapture
    setStageBounds(element)

    await stage.trigger('pointerdown', { clientX: 200, pointerId: 9 })
    await stage.trigger('pointermove', { clientX: 460, pointerId: 9 })

    expect(wrapper.get('[role="slider"]').attributes('aria-valuenow')).toBe('90')

    await stage.trigger('pointerup', { pointerId: 9 })

    expect(releasePointerCapture).toHaveBeenCalledWith(9)
  })

  it('releases active pointer capture on unmount', async () => {
    const wrapper = mountXray()
    const stage = wrapper.get('.project-xray__stage')
    const element = stage.element as HTMLElement
    const releasePointerCapture = vi.fn()
    element.setPointerCapture = vi.fn()
    element.releasePointerCapture = releasePointerCapture
    setStageBounds(element)

    await stage.trigger('pointerdown', { clientX: 200, pointerId: 8 })
    wrapper.unmount()

    expect(releasePointerCapture).toHaveBeenCalledWith(8)
  })
})
