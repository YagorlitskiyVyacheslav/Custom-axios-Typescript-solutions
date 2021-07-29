import Axios, {
  AxiosError,
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios'

// Example #1 Without axios methods

export const fetch: (config?: AxiosRequestConfig) => AxiosPromise<Response> = async (
  config = {}
) => {
  const token = localStorage.getItem('token')
  try {
    const opts = {
      baseURL: process.env.REACT_APP_API_URL,
      maxRedirects: 0,
      ...config,
      headers: { Authorization: token && `Bearer ${token}`, ...config.headers }
    }
    return (await Axios.request(opts)).data
  } catch (e) {
    if (e.response && typeof e.response.data === 'string') {
      throw new Error(e.response.data)
    }
    if (e.response && typeof e.response.data === 'object') throw e
    throw new Error('Something went wrong')
  }
}

// Example #1 Use Axios methods GET, POST, PUT, PATCH, DELETE

class Service {
  service: AxiosInstance
  constructor(token: string | null) {
    const service = Axios.create({
      baseURL: 'https://api.unsplash.com'
    })
    service.interceptors.response.use(this.handleSuccess, this.handleError)
    service.defaults.headers = token
      ? { Authorization: `Bearer ${token}` }
      : service.defaults.headers
    this.service = service
  }

  handleSuccess(response: AxiosResponse<Response>) {
    return response
  }

  handleError = (error: AxiosError) => {
    switch (error.response?.status) {
      case 401:
        this.redirectTo('/401')
        break
      case 404:
        this.redirectTo('/404')
        break
      default:
        this.redirectTo('/500')
        break
    }
    return Promise.reject(error)
  }

  redirectTo = (path: string) => {
    document.location.pathname = path
  }

  get(path: string, config?: AxiosRequestConfig) {
    return this.service.get(path, config)
  }

  patch<T>(path: string, payload: T, config?: AxiosRequestConfig) {
    return this.service.patch(path, payload, config)
  }

  put<T>(path: string, payload: T, config?: AxiosRequestConfig) {
    return this.service.patch(path, payload, config)
  }

  post<T>(path: string, payload: T, config?: AxiosRequestConfig) {
    return this.service.post(path, payload, config)
  }

  delete(path: string, config?: AxiosRequestConfig) {
    return this.service.delete(path, config)
  }
}

const service = new Service(localStorage.getItem('token'))

export default service
