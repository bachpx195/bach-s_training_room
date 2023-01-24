import { SET_STATE } from './mutation-types'
import { buildQueryString } from '../stuff/url-action'
import Const from '../stuff/constants.js'
import axios from "axios";

const { API_ENDPOINT } = Const

const getCommonOptions = context => {
  const headers = {}
  return { headers }
}

const handleError = (context, e) => {
  if (e.response && e.response.status === 401) context.commit(SET_STATE, { key: 'auth_info', value: null })
}

export async function apiGet (context, url, options = {}) {
  try {
    const opt = getCommonOptions(context)
    const response = await axios.get(`${API_ENDPOINT}/${url}`, Object.assign(opt, options))
    return response
  } catch (e) {
    handleError(context, e)
    throw e
  }
}

// call all of apis parallel
export async function apiGetAll (context, urls, options = {}) {
  try {
    const opt = getCommonOptions(context)
    const responses = await Promise.all(urls.map(url => axios.get(`${API_ENDPOINT}/${url}`, Object.assign(opt, options))))
    return responses
  } catch (e) {
    handleError(context, e)
    throw e
  }
}

export async function apiPost (context, url, params, options = {}) {
  try {
    const opt = getCommonOptions(context)
    const response = await axios.post(`${API_ENDPOINT}/${url}`, params, Object.assign(opt, options))
    return response
  } catch (e) {
    handleError(context, e)
    throw e
  }
}

export async function apiPut (context, url, params, options = {}) {
  try {
    const opt = await getCommonOptions(context)
    const response = await axios.put(`${API_ENDPOINT}/${url}`, params, Object.assign(opt, options))
    return response
  } catch (e) {
    handleError(context, e)
    throw e
  }
}

export async function apiPatch (context, url, params, options = {}) {
  try {
    const opt = await getCommonOptions(context)
    const response = await axios.patch(`${API_ENDPOINT}/${url}`, params, Object.assign(opt, options))
    return response
  } catch (e) {
    handleError(context, e)
    throw e
  }
}

export async function apiDelete (context, url, options = {}) {
  try {
    const opt = getCommonOptions(context)
    const response = await axios.delete(`${API_ENDPOINT}/${url}`, Object.assign(opt, options))
    return response
  } catch (e) {
    handleError(context, e)
    throw e
  }
}

const emptyPromise = () => {
  return new Promise((resolve, reject) => {
    resolve(null)
  })
}

export function getCandleStickData (context, payload) {
  const endpoint = 'candlesticks'
  const params = {
    merchandise_rate_id: payload.merchandise_rate_id,
    time_type: payload.time_type,
  }
  return apiGet(context, `${endpoint}/${buildQueryString(params)}`)
}

export function getMerchandisekData (context) {
  const endpoint = 'merchandise_rates'
  return apiGet(context, endpoint)
}
