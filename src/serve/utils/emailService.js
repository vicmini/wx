var request = require('request');
var crypto = require('crypto');

/**
 *
 * 阿里云短信发送接口 nodejs 版本
 */
const AliyunDMUtil = {
  'config': {
    'AccessKeyId': '', // 阿里邮件服务所用的密钥ID
    'AccessKeySecret': '', // 阿里邮件服务所用的密钥值
    'SignatureMethod': 'HMAC-SHA1', // 签名方式，目前支持HMAC-SHA1
    'Version': '2015-11-23', // API版本号，为日期形式：YYYY-MM-DD，本版本对应为2017-05-25
    'Action': 'SingleSendMail', // 操作接口名，系统规定参数
    'Format': 'JSON', // 返回值的类型，支持JSON与XML，默认为XML
    'SignatureVersion': '1.0' // 签名算法版本，目前版本是1.0
    //'SignatureNonce':'111'
  },

  /**
   * 阿里云短信发送接口
   * @param data  发送短信的参数，请查看阿里云短信模板中的变量做一下调整，格式如：{username:"username", phone:"156188376xx"}
   * @param callback 发送短信后的回调函数
   */
  'sendMessage': function (msg) {
    var that = this;
    var params = {
      'Action': that.config.Action, // 操作接口名，系统规定参数
      // 'SignName': that.config.SignName, // 短信签名名称
      // 'TemplateCode': that.config.TemplateCode, // 阿里短信模板CODE
      'Version': that.config.Version, // API版本号，为日期形式：YYYY-MM-DD，本版本对应为2016-09-27
      'Format': that.config.Format, // 返回值的类型，支持JSON与XML，默认为XML
      'AccessKeyId': that.config.AccessKeyId, // 阿里短信服务所用的密钥ID
      'SignatureMethod': that.config.SignatureMethod, // 签名方式，目前支持HMAC-SHA1
      'SignatureVersion': that.config.SignatureVersion, // 签名算法版本，目前版本是1.0
      'SignatureNonce': Math.random().toString(), // 唯一随机数，用于防止网络重放攻击。用户在不同请求间要使用不同的随机数值
      'Timestamp': new Date().toISOString(), // 日期格式按照ISO8601标准表示，并需要使用UTC时间。格式为YYYY-MM-DDThh:mm:ssZ
      'AccountName': 'victor@email.manba6.com',
      'ReplyToAddress': true,
      'AddressType': 1,
      'ToAddress': 'xiangpan3@xdf.cn,yangwenyu5@xdf.cn',
      'FromAlias': '生日提醒',
      'Subject': '生日提醒',
      'TextBody': msg
      // 'PhoneNumbers': data.phone, // 接受短信的手机号
      // 'TemplateParam': "{\"username\":\"" + data.username + "\"}" // c验证码模板里的变量
    };
    params.Signature = this.signature(params, that.config.AccessKeySecret);

    const apiUrl = 'https://dm.aliyuncs.com/';
    request.post({
      'url': apiUrl,
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      'form': params
    });
  },

  'percentEncode': function (value) {
    var encoded = encodeURIComponent(value);
    return encoded.replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
  },

  'signature': function (params, accessKeySecret) {
    const queryParams = [];
    let canonicalizedQueryString;
    var oa = Object.keys(params).sort();
    for (let i = 0; i < oa.length; i++) {
      let key = oa[i];
      queryParams.push(this.percentEncode(key) + '=' + this.percentEncode(params[key]));
    }
    canonicalizedQueryString = queryParams.join('&');
    let stringToSign = 'POST' + '&' + this.percentEncode('/') + '&' + this.percentEncode(canonicalizedQueryString);

    accessKeySecret = accessKeySecret + '&';
    return crypto.createHmac('sha1', accessKeySecret).update(new Buffer(stringToSign, 'utf-8')).digest('base64');
  }
};
export default AliyunDMUtil;
