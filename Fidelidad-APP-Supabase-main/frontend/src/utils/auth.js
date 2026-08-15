const TOKEN_KEY = 'token'

function decodePayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function saveToken(token) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

export function isTokenValid(token = getToken()) {
  if (!token) return false
  const payload = decodePayload(token)
  if (!payload?.exp) return false
  return payload.exp * 1000 > Date.now()
}

export function isAuthenticated() {
  const token = getToken()
  if (isTokenValid(token)) return true
  if (token) clearToken()
  return false
}
