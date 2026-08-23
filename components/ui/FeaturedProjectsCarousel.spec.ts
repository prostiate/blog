import { mount } from '@vue/test-utils'
import type { ProjectItem } from '../../types/project'
import { afterEach, describe, expect, it, vi } from 'vitest'
import FeaturedProjectsCarousel from './FeaturedProjectsCarousel.vue'

const projects: ProjectItem[] = [
  {
    path: '/projects/onotoolkit',
    title: 'OnoToolkit',
    category: 'Full Stack / In-Browser ML',
    description: 'Browser-local tools.',
    tags: ['Nuxt 4'],
    liveUrl: 'https://onotoolkit.irfankurniawan.com/',
    githubUrl: 'https://github.com/prostiate/onotoolkit'
  },
  {
    path: '/projects/fe-amazone-monorepo',
    title: 'Amazone Retail & POS Monorepo',
    category: 'Frontend / Architecture',
    description: 'Shared workspace.',
    tags: ['Nuxt']
  },
  {
    path: '/projects/pg-client-mobile',
    title: 'pg-client-mobile',
    category: 'Mobile / Database Tooling',
    description: 'Android PostgreSQL client.',
    tags: ['Flutter'],
    githubUrl: 'https://github.com/prostiate/pg-client-mobile'
  }
]

function mountCarousel(projectItems = projects, reducedMotion = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? reducedMotion : false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }))
  })

  return mount(FeaturedProjectsCarousel, {
    attachTo: document.body,
    props: { projects: projectItems },
    global: {
      stubs: {
        NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' }
      }
    }
  })
}

async function selectTab(wrapper: ReturnType<typeof mount>, index: number) {
  await wrapper.findAll('[role="tab"]')[index]!.trigger('click')
}

describe('FeaturedProjectsCarousel', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    document.body.innerHTML = ''
  })

  it('selects projects through tabs and wrapping scoped navigation', async () => {
    const wrapper = mountCarousel()

    expect(wrapper.findAll('[role="tab"]')).toHaveLength(3)
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('OnoToolkit')

    await selectTab(wrapper, 1)
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('Amazone Retail & POS Monorepo')

    await wrapper.get('[data-nav="next"]').trigger('click')
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('pg-client-mobile')
    await wrapper.get('[data-nav="next"]').trigger('click')
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('OnoToolkit')
  })

  it('uses one stable panel relationship for every tab', async () => {
    const wrapper = mountCarousel()
    const panel = wrapper.get('[role="tabpanel"]')
    const tabs = wrapper.findAll('[role="tab"]')

    expect(tabs.map((tab) => tab.attributes('aria-controls'))).toEqual([
      panel.attributes('id'),
      panel.attributes('id'),
      panel.attributes('id')
    ])
    expect(panel.attributes('aria-labelledby')).toBe(tabs[0]!.attributes('id'))

    await selectTab(wrapper, 2)
    expect(wrapper.get('[role="tabpanel"]').attributes('id')).toBe(panel.attributes('id'))
    expect(wrapper.get('[role="tabpanel"]').attributes('aria-labelledby')).toBe(
      tabs[2]!.attributes('id')
    )
  })

  it('uses roving tabindex and moves focus with scoped arrow navigation', async () => {
    const wrapper = mountCarousel()
    const tabs = wrapper.findAll('[role="tab"]')

    expect(tabs.map((tab) => tab.attributes('tabindex'))).toEqual(['0', '-1', '-1'])

    await wrapper.get('[role="tablist"]').trigger('keydown', { key: 'ArrowRight' })

    expect(tabs.map((tab) => tab.attributes('tabindex'))).toEqual(['-1', '0', '-1'])
    expect(document.activeElement).toBe(tabs[1]!.element)
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('Amazone Retail & POS Monorepo')
  })

  it('wraps backwards from the first project', async () => {
    const wrapper = mountCarousel()

    await wrapper.get('[data-nav="previous"]').trigger('click')

    expect(wrapper.get('[role="tabpanel"]').text()).toContain('pg-client-mobile')
  })

  it('changes project only at the 48-pixel swipe threshold in permitted zones', async () => {
    const wrapper = mountCarousel()
    const tablist = wrapper.get('[role="tablist"]')

    await tablist.trigger('pointerdown', { clientX: 100 })
    await tablist.trigger('pointerup', { clientX: 53 })
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('OnoToolkit')

    await tablist.trigger('pointerdown', { clientX: 100 })
    await tablist.trigger('pointerup', { clientX: 52 })
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('Amazone Retail & POS Monorepo')

    const textPanel = wrapper.get('[data-swipe-zone="text"]')
    expect(textPanel.classes()).toContain('touch-pan-y')
    await textPanel.trigger('pointerdown', { clientX: 100 })
    await textPanel.trigger('pointerup', { clientX: 148 })
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('OnoToolkit')
  })

  it('keeps X-ray pointer gestures isolated from project navigation', async () => {
    const wrapper = mountCarousel()
    const visual = wrapper.get('.project-xray__stage')

    await visual.trigger('pointerdown', { clientX: 100, pointerId: 5 })
    await visual.trigger('pointerup', { clientX: 0, pointerId: 5 })

    expect(wrapper.get('[role="tabpanel"]').text()).toContain('OnoToolkit')
  })

  it('maps approved paths to their scenes and exposes an accessible fallback', async () => {
    const wrapper = mountCarousel()

    expect(wrapper.get('img').attributes('alt')).toBe('OnoToolkit browser tools home screen')
    await selectTab(wrapper, 1)
    expect(wrapper.text()).toContain('6 production apps')
    await selectTab(wrapper, 2)
    expect(wrapper.get('img').attributes('alt')).toBe(
      'pg-client-mobile SQL editor and command menu'
    )

    const fallback = mountCarousel([
      {
        path: '/projects/unknown',
        title: 'Unknown project',
        category: 'Prototype',
        description: 'Fallback example.',
        tags: ['TypeScript']
      }
    ])
    expect(fallback.get('[aria-label="Unknown project architecture summary"]').text()).toContain(
      'TypeScript'
    )
    expect(fallback.find('.project-xray').exists()).toBe(false)
  })

  it('uses a static active-tab indicator when motion is reduced', async () => {
    const animatedWrapper = mountCarousel()
    expect(
      animatedWrapper.get('[data-active-tab-indicator]').attributes('data-active-tab-indicator')
    ).toBe('motion')
    expect(animatedWrapper.get('[role="tabpanel"]').attributes('style')).toContain(
      'translateY(8px)'
    )

    const wrapper = mountCarousel(projects, true)

    expect(wrapper.get('[data-active-tab-indicator]').attributes('data-active-tab-indicator')).toBe(
      'static'
    )
    expect(wrapper.get('[role="tabpanel"]').attributes('style')).not.toContain('translateY')

    await selectTab(wrapper, 1)
    expect(wrapper.get('[data-active-tab-indicator]').attributes('data-active-tab-indicator')).toBe(
      'static'
    )
  })

  it('keeps only the approved metadata hierarchy and destinations', () => {
    const projectsWithExcludedMetadata = projects.map((project) => ({
      ...project,
      problemSolved: 'This must not render.',
      architecture: ['This must not render.']
    }))
    const wrapper = mountCarousel(projectsWithExcludedMetadata)

    expect(wrapper.text()).not.toContain('This must not render.')
    expect(wrapper.text()).not.toContain('Engineering Decision')
    expect(wrapper.text()).not.toContain('NDA-safe architecture')
    expect(wrapper.get('a[href="/projects/onotoolkit"]').text()).toBe('Read case study')
    expect(wrapper.get('a[href="https://onotoolkit.irfankurniawan.com/"]').text()).toBe(
      'Live project'
    )
    expect(wrapper.get('a[href="https://github.com/prostiate/onotoolkit"]').text()).toBe(
      'Source code'
    )
  })

  it('omits unavailable optional project links', async () => {
    const wrapper = mountCarousel()

    await selectTab(wrapper, 1)

    expect(wrapper.text()).not.toContain('Live project')
    expect(wrapper.text()).not.toContain('Source code')
  })

  it('does not render an empty carousel section', () => {
    expect(mountCarousel([]).find('section').exists()).toBe(false)
  })
})
