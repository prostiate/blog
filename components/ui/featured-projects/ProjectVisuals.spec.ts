import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AmazoneMonorepoVisual from './AmazoneMonorepoVisual.vue'
import OnoToolkitVisual from './OnoToolkitVisual.vue'
import PgClientMobileVisual from './PgClientMobileVisual.vue'

describe('project-specific X-ray visuals', () => {
  it('shows OnoToolkit public product art and its on-device processing flow', () => {
    const ono = mount(OnoToolkitVisual)

    expect(ono.text()).toContain('Files stay on this device')
    expect(ono.find('img').attributes('src')).toBe('/assets/projects/onotoolkit-showcase.webp')
    expect(ono.find('img').attributes('alt')).toBe('OnoToolkit browser tools home screen')
    expect(ono.text()).toContain('Local file to WebGPU / WASM to Canvas output to Download')
  })

  it('renders every directed OnoToolkit desktop edge in the decorative connector', () => {
    const ono = mount(OnoToolkitVisual)
    const desktopLines = ono.get('.ono-lines--desktop')

    expect(desktopLines.attributes('aria-hidden')).toBe('true')
    expect(desktopLines.get('[data-edge="local-to-wasm"]').attributes('d')).toBe('M125 100 H220')
    expect(desktopLines.get('[data-edge="wasm-to-canvas"]').attributes('d')).toBe('M275 100 H370')
    expect(desktopLines.get('[data-edge="canvas-to-download"]').attributes('d')).toBe(
      'M425 100 H520'
    )
    expect(desktopLines.get('[data-edge="wasm-to-indexeddb"]').attributes('d')).toBe(
      'M225 130 V215'
    )
  })

  it('uses breakpoint-specific connector variants for OnoToolkit and pg-client workflows', () => {
    const ono = mount(OnoToolkitVisual)
    const pg = mount(PgClientMobileVisual)

    expect(ono.get('.ono-lines--desktop').attributes('data-layout')).toBe('desktop')
    expect(ono.get('.ono-lines--mobile').attributes('data-layout')).toBe('mobile')
    expect(pg.get('.pg-lines--desktop').attributes('data-layout')).toBe('desktop')
    expect(pg.get('.pg-lines--mobile').attributes('data-layout')).toBe('mobile')
  })

  it('anchors mobile connectors to the OnoToolkit diagram card edges', () => {
    const ono = mount(OnoToolkitVisual)
    const mobileLines = ono.get('.ono-lines--mobile')

    expect(mobileLines.findAll('[data-node]').map((node) => node.attributes('data-node'))).toEqual([
      'local-file',
      'webgpu-wasm',
      'canvas-output',
      'download',
      'indexeddb'
    ])
    expect(mobileLines.get('[data-edge="local-to-wasm"]').attributes('d')).toBe('M95 70 V100')
    expect(mobileLines.get('[data-edge="wasm-to-canvas"]').attributes('d')).toBe('M95 150 V180')
    expect(mobileLines.get('[data-edge="canvas-to-download"]').attributes('d')).toBe('M95 230 V260')
    expect(mobileLines.get('[data-edge="wasm-to-indexeddb"]').attributes('d')).toBe('M170 125 H220')
  })

  it('anchors mobile connectors to the pg-client workflow card edges', () => {
    const pg = mount(PgClientMobileVisual)
    const mobileLines = pg.get('.pg-lines--mobile')

    expect(mobileLines.findAll('[data-node]').map((node) => node.attributes('data-node'))).toEqual([
      'connection',
      'object-browser',
      'sql-editor',
      'shortcut-guard',
      'results-and-logs'
    ])
    expect(mobileLines.get('[data-edge="connection-to-browser"]').attributes('d')).toBe(
      'M170 42 H230'
    )
    expect(mobileLines.get('[data-edge="browser-to-editor"]').attributes('d')).toBe('M305 65 V105')
    expect(mobileLines.get('[data-edge="editor-to-guard"]').attributes('d')).toBe('M230 127 H170')
    expect(mobileLines.get('[data-edge="guard-to-results"]').attributes('d')).toBe('M95 150 V190')
  })

  it('hides visual node diagrams from assistive technology when flow descriptions are present', () => {
    const ono = mount(OnoToolkitVisual)
    const amazone = mount(AmazoneMonorepoVisual)
    const pg = mount(PgClientMobileVisual)

    expect(ono.get('.ono-flow').attributes('aria-hidden')).toBe('true')
    expect(amazone.get('.amazone-flow').attributes('aria-hidden')).toBe('true')
    expect(pg.get('.pg-flow').attributes('aria-hidden')).toBe('true')
  })

  it('uses an abstract, public-safe Amazone visual without an image or sensitive data', () => {
    const amazone = mount(AmazoneMonorepoVisual)

    expect(amazone.text()).toContain('@amazone/base')
    expect(amazone.text()).toContain('6 production apps')
    expect(amazone.find('img').exists()).toBe(false)
    expect(amazone.html()).not.toMatch(/revenue|cashier data|employee|customer/i)
  })

  it('shows the pg-client-mobile screenshot and shortcut guard workflow', () => {
    const pg = mount(PgClientMobileVisual)

    expect(pg.text()).toContain('Shortcut guard')
    expect(pg.find('img').attributes('src')).toBe('/assets/projects/pg-client-mobile-showcase.webp')
    expect(pg.find('img').attributes('alt')).toBe('pg-client-mobile SQL editor and command menu')
    expect(pg.text()).toContain(
      'Connection to Object browser to SQL editor to Shortcut guard to Results and logs'
    )
  })

  it('falls back to OnoToolkit architecture when its product image cannot load', async () => {
    const ono = mount(OnoToolkitVisual)

    await ono.find('img').trigger('error')

    expect(ono.find('img').exists()).toBe(false)
    expect(ono.get('[role="slider"]').attributes('aria-valuenow')).toBe('0')
  })

  it('falls back to pg-client-mobile architecture when its product image cannot load', async () => {
    const pg = mount(PgClientMobileVisual)

    await pg.find('img').trigger('error')

    expect(pg.find('img').exists()).toBe(false)
    expect(pg.get('[role="slider"]').attributes('aria-valuenow')).toBe('0')
  })
})
