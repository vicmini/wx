import axios from 'axios';
import config from '../config';
export default class WxModel {
  getToken() {
    return axios.get(`${config.wxApi}/cgi-bin/token`, {
      'params': {
        'grant_type': 'client_credential',
        'appid': config.appID,
        'secret': config.appsecret
      }
    });
  }
  sendMsg() {
    return axios.post(`${config.wxApi}/cgi-bin/message/template/send?access_token=15_e3-DtxCOcMDxQAdBkxk9Xss8IYkPkttjxri_Ee_KBAjYuoK4EB_8oCYBMw041SSUqFF_CsfWMUkNAO9_AJnoJIVbHuRbzOcZ5zpp2faTZkn2BkRwpMV9Un_uebiJIzyVFUEmwuNJ1i2v5KzRJRUiAHAWEH`, {
      'touser': 'oLCm50X-YibLS0AoPaFdqXwQSTok',
      'template_id': 'sAmBvsvjTtAT8tZddz6UxmuWveIeTdA1uG5lhfJOCmg',
      'data': {
        'name':{
          'value':'victor',
          'color':'#00ffff'
        }
      }
    });
  }
}
