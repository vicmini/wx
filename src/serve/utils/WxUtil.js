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
  async sendMsg() {
    const tokenData = await this.getToken();
    const accessKoken = tokenData.data.access_token;
    return axios.post(`${config.wxApi}/cgi-bin/message/template/send?access_token=${accessKoken}`, {
      'touser': 'oLCm50X-YibLS0AoPaFdqXwQSTok',
      'template_id': 'sAmBvsvjTtAT8tZddz6UxmuWveIeTdA1uG5lhfJOCmg',
      'data': {
        'name': {
          'value': 'victor',
          'color': '#00ffff'
        }
      }
    });
  }
}
