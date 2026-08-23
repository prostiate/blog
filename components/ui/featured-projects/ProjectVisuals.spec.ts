import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AmazoneMonorepoVisual from './AmazoneMonorepoVisual.vue'
import OnoToolkitVisual from './OnoToolkitVisual.vue'
import PgClientMobileVisual from './PgClientMobileVisual.vue'

function stubViewport(isMobile: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: isMobile,
      media: '(max-width: 639px)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })
  )
}

function getRect(
  wrapper: ReturnType<typeof mount>,
  node: string
): Record<'x' | 'y' | 'width' | 'height', number> {
  const rect = wrapper.get(`[data-node="${node}"] rect`)

  return Object.fromEntries(
    ['x', 'y', 'width', 'height'].map((name) => [name, Number(rect.attributes(name))])
  ) as Record<'x' | 'y' | 'width' | 'height', number>
}

function getEdgeEndpoints(wrapper: ReturnType<typeof mount>, edge: string) {
  const path = wrapper.get(`[data-edge="${edge}"]`).attributes('d')
  if (!path) throw new Error(`Connector ${edge} has no path data`)

  const match = path.match(/^M(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?) ([HV])(-?\d+(?:\.\d+)?)$/)

  if (!match) throw new Error(`Unsupported connector path: ${path}`)

  const [, startX, startY, axis, endCoordinate] = match
  const x = Number(startX)
  const y = Number(startY)
  const end = Number(endCoordinate)

  return {
    start: { x, y },
    end: axis === 'H' ? { x: end, y } : { x, y: end }
  }
}

describe('project-specific X-ray visuals', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

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

  it('renders only the active connector variant at each responsive breakpoint', async () => {
    stubViewport(false)
    const desktopOno = mount(OnoToolkitVisual)
    const desktopPg = mount(PgClientMobileVisual)

    await nextTick()

    expect(desktopOno.find('.ono-lines--desktop').exists()).toBe(true)
    expect(desktopOno.find('.ono-lines--mobile').exists()).toBe(false)
    expect(desktopPg.find('.pg-lines--desktop').exists()).toBe(true)
    expect(desktopPg.find('.pg-lines--mobile').exists()).toBe(false)

    stubViewport(true)
    const mobileOno = mount(OnoToolkitVisual)
    const mobilePg = mount(PgClientMobileVisual)

    await nextTick()

    expect(mobileOno.find('.ono-lines--desktop').exists()).toBe(false)
    expect(mobileOno.find('.ono-lines--mobile').exists()).toBe(true)
    expect(mobilePg.find('.pg-lines--desktop').exists()).toBe(false)
    expect(mobilePg.find('.pg-lines--mobile').exists()).toBe(true)
  })

  it('anchors mobile connectors to the OnoToolkit diagram card edges', async () => {
    stubViewport(true)
    const ono = mount(OnoToolkitVisual)

    await nextTick()
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

  it('anchors mobile connectors to the pg-client workflow card edges', async () => {
    stubViewport(true)
    const pg = mount(PgClientMobileVisual)

    await nextTick()
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

  it('places mobile connectors before their cards and on the intended card boundaries', async () => {
    stubViewport(true)
    const ono = mount(OnoToolkitVisual)
    const pg = mount(PgClientMobileVisual)

    await nextTick()
    const onoMobile = ono.get('.ono-lines--mobile')
    const pgMobile = pg.get('.pg-lines--mobile')

    expect(
      onoMobile
        .get('[data-layer="connectors"]')
        .element.compareDocumentPosition(onoMobile.get('[data-layer="nodes"]').element)
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(
      pgMobile
        .get('[data-layer="connectors"]')
        .element.compareDocumentPosition(pgMobile.get('[data-layer="nodes"]').element)
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)

    expect(getRect(ono, 'webgpu-wasm')).toEqual({ x: 20, y: 100, width: 150, height: 50 })
    expect(getRect(ono, 'indexeddb')).toEqual({ x: 220, y: 100, width: 150, height: 50 })
    expect(getRect(pg, 'shortcut-guard')).toEqual({ x: 20, y: 105, width: 150, height: 45 })
    expect(getRect(pg, 'results-and-logs')).toEqual({ x: 20, y: 190, width: 360, height: 45 })
  })

  it('attaches every mobile connector to its source and target card boundary', async () => {
    stubViewport(true)
    const ono = mount(OnoToolkitVisual)
    const pg = mount(PgClientMobileVisual)

    await nextTick()

    const localFile = getRect(ono, 'local-file')
    const wasm = getRect(ono, 'webgpu-wasm')
    const canvas = getRect(ono, 'canvas-output')
    const download = getRect(ono, 'download')
    const indexedDb = getRect(ono, 'indexeddb')

    expect(getEdgeEndpoints(ono, 'local-to-wasm')).toEqual({
      start: { x: localFile.x + localFile.width / 2, y: localFile.y + localFile.height },
      end: { x: wasm.x + wasm.width / 2, y: wasm.y }
    })
    expect(getEdgeEndpoints(ono, 'wasm-to-canvas')).toEqual({
      start: { x: wasm.x + wasm.width / 2, y: wasm.y + wasm.height },
      end: { x: canvas.x + canvas.width / 2, y: canvas.y }
    })
    expect(getEdgeEndpoints(ono, 'canvas-to-download')).toEqual({
      start: { x: canvas.x + canvas.width / 2, y: canvas.y + canvas.height },
      end: { x: download.x + download.width / 2, y: download.y }
    })
    expect(getEdgeEndpoints(ono, 'wasm-to-indexeddb')).toEqual({
      start: { x: wasm.x + wasm.width, y: wasm.y + wasm.height / 2 },
      end: { x: indexedDb.x, y: indexedDb.y + indexedDb.height / 2 }
    })

    const connection = getRect(pg, 'connection')
    const browser = getRect(pg, 'object-browser')
    const editor = getRect(pg, 'sql-editor')
    const guard = getRect(pg, 'shortcut-guard')
    const results = getRect(pg, 'results-and-logs')

    const connectionToBrowser = getEdgeEndpoints(pg, 'connection-to-browser')
    expect(connectionToBrowser.start.x).toBe(connection.x + connection.width)
    expect(connectionToBrowser.end.x).toBe(browser.x)
    expect(connectionToBrowser.start.y).toBeGreaterThanOrEqual(connection.y)
    expect(connectionToBrowser.start.y).toBeLessThanOrEqual(connection.y + connection.height)
    expect(connectionToBrowser.end.y).toBeGreaterThanOrEqual(browser.y)
    expect(connectionToBrowser.end.y).toBeLessThanOrEqual(browser.y + browser.height)

    expect(getEdgeEndpoints(pg, 'browser-to-editor')).toEqual({
      start: { x: browser.x + browser.width / 2, y: browser.y + browser.height },
      end: { x: editor.x + editor.width / 2, y: editor.y }
    })
    const editorToGuard = getEdgeEndpoints(pg, 'editor-to-guard')
    expect(editorToGuard.start.x).toBe(editor.x)
    expect(editorToGuard.end.x).toBe(guard.x + guard.width)
    expect(editorToGuard.start.y).toBeGreaterThanOrEqual(editor.y)
    expect(editorToGuard.start.y).toBeLessThanOrEqual(editor.y + editor.height)
    expect(editorToGuard.end.y).toBeGreaterThanOrEqual(guard.y)
    expect(editorToGuard.end.y).toBeLessThanOrEqual(guard.y + guard.height)

    const guardToResults = getEdgeEndpoints(pg, 'guard-to-results')
    expect(guardToResults.start.x).toBeGreaterThanOrEqual(guard.x)
    expect(guardToResults.start.x).toBeLessThanOrEqual(guard.x + guard.width)
    expect(guardToResults.start.y).toBe(guard.y + guard.height)
    expect(guardToResults.end.x).toBeGreaterThanOrEqual(results.x)
    expect(guardToResults.end.x).toBeLessThanOrEqual(results.x + results.width)
    expect(guardToResults.end.y).toBe(results.y)
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
