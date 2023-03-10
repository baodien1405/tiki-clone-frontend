import jwtDecode from 'jwt-decode'
import axios, { AxiosRequestConfig, AxiosResponse, AxiosHeaders } from 'axios'
import { getAccessTokenFromLS } from '@/utils'
import { TokenDecode } from '@/types'
import authApi from './auth.api'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor
axiosClient.interceptors.request.use(
  async function (config: AxiosRequestConfig) {
    // Do something before request is sent
    const accessToken = getAccessTokenFromLS()
    if (accessToken && config.headers) {
      ;(config.headers as AxiosHeaders).set('Authorization', `Bearer ${accessToken}`)
      return config
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export default axiosClient
