import axios from 'axios'
import {baseUrl} from './Constants'
const instance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,   // ✅ important for login/signup sessions

});

export default instance