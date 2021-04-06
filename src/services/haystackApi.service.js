import axios from 'axios'

class HaystackApiService {
  constructor({ haystackApiHost }) {
    this.haystackApiHost = haystackApiHost
  }
  // Invoquer ops pour savoir les méthodes qui sont disponibles
  // Invoquer format pour savoir si l'api est compatible avec le format JSON

  get api() {
    return axios.create({
      baseURL: `${this.haystackApiHost}`,
      timeout: 20000,
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async isHaystackApi() {
    try {
      const opsResponse = await this.api.get(`/ops`)
      const formatResponse = await this.api.get(`/formats`)
      const isHaystackApiAvailable =
        opsResponse.data.rows.find(row => row.name === 's:read') &&
        formatResponse.data.rows.find(row => row.mime === 's:application/json' && row.receive === 'm:')
      if (isHaystackApiAvailable) return true
      alert('API not available for')
      return false
    } catch {
      alert('Not an Haystack API')
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
  async getEntity(entity) {
    try {
      const response = await this.api.get(`/read?filter=${entity}&limit=40`)
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
      return response.data.rows
    } catch {
      return []
    }
  }
}

export default HaystackApiService
