import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const read = (name: string) => readFileSync(`content/projects/${name}.md`, 'utf8')

describe('project portfolio claims', () => {
  it('features exactly the three approved homepage projects', () => {
    const states = {
      onotoolkit: /featured: true/.test(read('onotoolkit')),
      monorepo: /featured: true/.test(read('fe-amazone-monorepo')),
      pgClient: /featured: true/.test(read('pg-client-mobile')),
      accessButtons: /featured: true/.test(read('access-buttons')),
      auth: /featured: true/.test(read('amazone-auth-service')),
      platform: /featured: true/.test(read('k8s-docker-migration'))
    }
    expect(states).toEqual({
      onotoolkit: true,
      monorepo: true,
      pgClient: true,
      accessButtons: false,
      auth: false,
      platform: false
    })
  })

  it('does not publish unsupported claims', () => {
    const all = [
      'onotoolkit',
      'fe-amazone-monorepo',
      'pg-client-mobile',
      'access-buttons',
      'amazone-auth-service',
      'k8s-docker-migration'
    ]
      .map(read)
      .join('\n')

    const forbidden = [
      'reducing maintenance cycles by over 60%',
      '95% down to under 25%',
      '7 minutes to 1.5 minutes',
      'Zero reported browser freezes',
      'AST-based query inspection',
      'affected row estimates',
      'AES-256 GCM',
      'SSH tunnel private keys',
      'Redis session blacklist',
      'Short-lived (15 minutes)',
      '@hasPermission',
      'Sub-Millisecond Auth Checks',
      '20-component K8s stack',
      '100% uptime'
    ]

    for (const phrase of forbidden) expect(all).not.toContain(phrase)
    expect(all).not.toContain('\u2014')
  })

  it('stores showcase assets locally', () => {
    expect(existsSync('public/assets/projects/onotoolkit-showcase.webp')).toBe(true)
    expect(existsSync('public/assets/projects/pg-client-mobile-showcase.webp')).toBe(true)
  })

  it('crops the OnoToolkit showcase above the prohibited sentence', () => {
    const asset = readFileSync('public/assets/projects/onotoolkit-showcase.webp')
    const dimensions = {
      width: asset.readUInt16LE(26) & 0x3fff,
      height: asset.readUInt16LE(28) & 0x3fff
    }

    expect(asset.subarray(8, 16).toString('ascii')).toBe('WEBPVP8 ')
    expect(dimensions).toEqual({ width: 1280, height: 350 })
  })
})
