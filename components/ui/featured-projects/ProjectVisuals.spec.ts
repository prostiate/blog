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
