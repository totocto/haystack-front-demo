import HaystackApiService from './haystackApi.service'

window.env = window.env || {}

const haystackApiHost = window.env.HAYSTACK_API_HOST

const haystackApiService = new HaystackApiService({ haystackApiHost })

export { haystackApiService }
