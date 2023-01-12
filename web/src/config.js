console.log(process.env.NODE_ENV)
const isProduction = process.env.NODE_ENV !== 'development'
export const API_URL = isProduction ? '' : 'http://localhost:4000'
