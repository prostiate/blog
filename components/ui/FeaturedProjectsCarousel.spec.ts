import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import FeaturedProjectsCarousel from './FeaturedProjectsCarousel.vue'

const projects = [
  {
    path: '/projects/onotoolkit',
    title: 'OnoToolkit',
    category: 'Full Stack / In-Browser ML',
    description: 'Browser-local tools.',
    tags: ['Nuxt 4']
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
    tags: ['Flutter']
  }
]

function mountCarousel(projectItems = projects) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })
  })

  return mount(FeaturedProjectsCarousel, {
    props: { projects: projectItems },
    global: {
      stubs: {
        NuxtLink: { template: '<a><slot /></a>' }
      }
    }
  })
}

describe('FeaturedProjectsCarousel', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('selects projects through tabs and wrapping scoped navigation', async () => {
    const wrapper = mountCarousel()

    expect(wrapper.findAll('[role="tab"]')).toHaveLength(3)
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('OnoToolkit')
    expect(wrapper.text()).not.toContain('Engineering Decision')

    await wrapper.findAll('[role="tab"]')[1]!.trigger('click')
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('Amazone Retail & POS Monorepo')

    await wrapper.get('[data-nav="next"]').trigger('click')
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('pg-client-mobile')
    await wrapper.get('[data-nav="next"]').trigger('click')
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('OnoToolkit')

    await wrapper.get('[role="tablist"]').trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.get('[role="tabpanel"]').text()).toContain('pg-client-mobile')
  })

  it('does not render an empty carousel section', () => {
    expect(mountCarousel([]).find('section').exists()).toBe(false)
  })
})
