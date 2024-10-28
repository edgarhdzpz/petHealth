//instancia de axios para implementar el backend

import axios from "axios";

// import { create } from "react-test-renderer";
export const apiClientOld = axios.create({
  baseURL: 'http://192.168.1.120:3000/',
//   timeout: 1000,
  headers: 
  {
    'Autorization': 'Bearer'
  }
});
