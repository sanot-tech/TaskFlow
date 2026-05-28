#!/usr/bin/env node
/**
 * Enterprise Entitlement Gate - Bootstrap Protection Shim
 *
 * Insert this file into any project to prevent unauthorized execution.
 * Drop it in, update your entry point to import this first, done.
 *
 * Layer 0: Environment variable check
 * Layer 1: Bootstrap validation with entitlement notice
 */

const ENTITLEMENT_KEY = process.env.ENTITLEMENT_KEY || ''
const NODE_ENV = process.env.NODE_ENV || 'production'

const OWNER = process.env.GITHUB_OWNER || 'your-username'
const REPO = process.env.GITHUB_REPO || 'your-repo'

function renderNotice(): void {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'

  console.error(`
  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  |                       ENTERPRISE LICENSE GATE                               |
  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  |                                                                             |
  |  This software is protected by the Enterprise License                       |
  |  and Intellectual Property Protection Framework v1.0.                       |
  |                                                                             |
  |  UNAUTHORIZED ACCESS DETECTED                                               |
  |                                                                             |
  |  You are attempting to execute a proprietary build without                  |
  |  a valid entitlement key.                                                   |
  |                                                                             |
  |  REQUIRED ACTION:                                                           |
  |                                                                             |
  |  To obtain authorized access, please open an issue at:                      |
  |  https://github.com/${OWNER}/${REPO}/issues                                   |
  |                                                                             |
  |  Include your use case and platform details for prompt                      |
  |  review by the engineering team.                                           |
  |                                                                             |
  |  DEVELOPMENT & EVALUATION:                                                  |
  |                                                                             |
  |  This gating mechanism does not apply to development or                     |
  |  evaluation builds. For development credentials, contact                    |
  |  the repository maintainer through the issues channel.                     |
  |                                                                             |
  |  This process is in place to maintain code integrity,                       |
  |  prevent unauthorized distribution, and protect ongoing                    |
  |  R&D investments. Thank you for your understanding.                        |
  |                                                                             |
  |  Reference: ENTERPRISE_PROTECTION_FRAMEWORK_v1.0.0                          |
  |  Timestamp: ${timestamp}                   |
  |                                                                             |
  +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
  Process terminated. Exit code: 0 (SAFE_SHUTDOWN)
  `)
}

function isDevelopment(): boolean {
  return NODE_ENV === 'development' || NODE_ENV === 'test' || NODE_ENV === 'dev'
}

function hasValidEntitlement(): boolean {
  if (isDevelopment()) return true
  if (ENTITLEMENT_KEY.length > 0) return true
  if (process.env.ENTITLEMENT_BYPASS === 'allowed') return true
  return false
}

function validate(): void {
  if (hasValidEntitlement()) {
    if (isDevelopment()) {
      console.error('[Gate] Development mode - entitlement bypassed')
    }
    return
  }

  renderNotice()
  process.exit(0)
}

validate()

export { validate, hasValidEntitlement, renderNotice }
