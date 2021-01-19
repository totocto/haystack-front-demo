import axios from 'axios'

class HaystackApiService {
  constructor({ haystackApiHost }) {
    this.haystackApiHost = haystackApiHost
  }

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

  async getHaystackInformation() {
    const response = await this.api.get('/about')
    return response.data
  }

  async getEntity(entity) {
    const response = await this.api.get(`/read?filter=${entity}`)
    return response.data
  }
}

export default HaystackApiService
