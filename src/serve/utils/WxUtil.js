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
  async sendMsg(staff) {
    const tokenData = await this.getToken();
    const accessKoken = tokenData.data.access_token;
    return axios.post(`${config.wxApi}/cgi-bin/message/template/send?access_token=${accessKoken}`, {
      'touser': 'oLCm50U0A4PMJLp4ewekKPKJuRa8',
      'template_id': 'KvcRPIT8TJbPzYi9I3WUtLxmhmbFc2bG01--GpiToiE',
      'data': {
        'name': {
          'value': staff,
          'color': '#00ffff'
        }
      }
    });
  }
}
