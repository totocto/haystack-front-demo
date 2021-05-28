import axios from 'axios'

class HaystackApiService {
  constructor({ haystackApiHost, apiKey }) {
    this.haystackApiHost = haystackApiHost
    this.apiKey = apiKey
  }
  // Invoquer ops pour savoir les méthodes qui sont disponibles
  // Invoquer format pour savoir si l'api est compatible avec le format JSON

  get api() {
    const headers = this.apiKey
      ? {
          'Content-Type': 'application/json',
          KeyId: this.apiKey
        }
      : {
          'Content-Type': 'application/json'
        }
    return axios.create({
      baseURL: `${this.haystackApiHost}`,
      timeout: 20000,
      withCredentials: false,
      headers
    })
  }

  async isHaystackApi() {
    try {
      const opsResponse = await this.api.get(`/ops`)
      const formatResponse = await this.api.get(`/formats`)
      const isHaystackApiAvailable =
        opsResponse.data.rows.find(row => row.name === 's:read') &&
        formatResponse.data.rows.find(row => row.mime === 's:application/json' && row.receive === 'm:')
      if (isHaystackApiAvailable) return 'available'
      alert('unavailable')
      return 'unavailable'
    } catch (error) {
      const statusCodeError = error.response.status
      if (statusCodeError === 403 || statusCodeError === 401) {
        return 'notAuthenticated'
      }
      if (statusCodeError === 404) {
        alert('this is not a haystack API')
        return 'unreachable'
      }
      if (statusCodeError === 500) {
        alert('internal error')
        return 'internError'
      }
      return false
    }
  }

  async isHisReadAvailable() {
    try {
      const response = await this.api.get(`/ops`)
      if (response.data.rows.find(row => row.name === 's:hisRead')) return true
      return false
    } catch {
      return false
    }
  }

  // getEntity => read  and entity => filter
  async getEntity(entity, limit, version = '') {
    const versionParam = version === '' ? '' : `&version=${new Date(version).toISOString()}`
    try {
      const response = await this.api.get(`/read?filter=${entity}&limit=${limit}${versionParam}`)
      return response.data
    } catch {
      return []
    }
  }

  // getHistory => hisRead
  async getHistory(id, range = '2020-01-01,2022-12-31') {
    try {
      const response =
        range === ','
          ? await this.api.get(`/hisRead?id=@${id}`)
          : await this.api.get(`/hisRead?id=@${id}&range=${range}`)
      const kindValues = response.data.cols.kind
      if (kindValues === 's:Number') return response.data.rows.slice(0, 40)
      return response.data.rows.slice(0, 20)
    } catch {
      return []
    }
  }
}

export default HaystackApiService
