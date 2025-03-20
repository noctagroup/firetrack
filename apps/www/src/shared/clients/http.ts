import axios from "axios"

import { env } from "~/env"

export const httpClient = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfHeaderName: "X-CSRFToken",
  xsrfCookieName: "csrftoken",
})
