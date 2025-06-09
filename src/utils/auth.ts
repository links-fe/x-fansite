'use client'

function generateRandomString(length: number): string {
  const array = new Uint8Array(length)
  window.crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export async function generatePKCE() {
  const codeVerifier = generateRandomString(64)
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  return { codeVerifier, codeChallenge }
}
