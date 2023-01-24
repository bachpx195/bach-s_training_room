// Build query string for url
// params format
// Object {
// param_name: value
// }
// Ex: params = { code: 'abc', 'test': 'true', 'hoge': null }
// ---> Return query string: '?code=abc&test=true'
export const buildQueryString = params => {
  const queryString = Object.keys(params).filter(key => params[key] && (!Array.isArray(params[key]) || params[key].length > 0)).map(key => {
    if (!Array.isArray(params[key])) return `${key}=${encodeURIComponent(params[key])}`
    return params[key].filter(v => v).map(v => `${key}=${encodeURIComponent(v)}`).join('&')
  }).join('&')
  return queryString ? `?${queryString}` : ''
}

export const addTrailingSlash = path => {
  if (!path.includes('?') && !path.includes('#')) return /\/$/.test(path) ? path : `${path}/`

  const characters = []
  for (let i = 0; i < path.length; i++) {
    if ((path[i] === '?' || path[i] === '#') && (characters.length === 0 || characters[characters.length - 1] !== '/')) {
      characters.push(`/`)
    }
    characters.push(path[i])
  }
  return characters.join('')
}
