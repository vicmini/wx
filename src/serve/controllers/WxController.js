import {
  route,
  GET
  // POST,
  // before
} from 'awilix-koa';
@route('/wx')
class WxController{
  constructor({wxModel}){
    this.wxModel = wxModel;
  }
  @route('/getToken')
  @GET()
  async getAccessToken(ctx){
    const token = await this.wxModel.getToken();
    console.log(token.data);
    ctx.body = token.data;
  }
  @route('/send')
  @GET()
  async sendMsg(ctx){
    const data = await this.wxModel.sendMsg();
    console.log(data.data);
    ctx.body = '发送成功';
  }
}
export default WxController;
