import axios from 'axios';

 export const api = axios.create({
  baseURL: 'http://172.16.1.205:3333'

})