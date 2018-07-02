import {environment} from '../environments/environment';

console.log(environment);

export const CONFIG = {
  'webHost': environment.webHost,
  'prefix': {
    'front': environment.webHost + '/front',
    'admin': environment.webHost + '/admin',
    'api': environment.webHost + '/api',
    'wApi': environment.webHost + '/wApi'
  }
};
