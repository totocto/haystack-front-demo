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

  // getEntity => read  and entity => filter
  async getEntity(entity) {
    const response = await this.api.get(`/read?filter=${entity}`)
    return response.data
  }

  // getHistory => hisRead
  async getHistory(id, range = 'today') {
    const response = await this.api.get(`/hisRead?id=@${id}&range=${range}`)
    return response.data.rows
  }
}

export default HaystackApiService
