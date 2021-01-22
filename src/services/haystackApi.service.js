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

  async getEntity(entity) {
    const response = await this.api.get(`/read?filter=${entity}`)
    return response.data
  }

  async getHistory(id, range = 'today') {
    const response = await this.api.get(`/hisRead?id=@${id}&range=${range}`)
    return response.data.rows
  }
}

export default HaystackApiService
