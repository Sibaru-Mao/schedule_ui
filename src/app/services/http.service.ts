// import { ConfigServiceService } from './configService/config-service.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  ROOTURL: string
  httpOptions: any
  // ROOTURL2: string
  // ROOTURL3: string

  constructor(
    private http: HttpClient,
    // private configService: ConfigServiceService
    // private message: NzMessageService
  ) {
    // let config = this.configService.getSpecificConfigure('datasources')
    // this.ROOTURL = config.host;
    this.ROOTURL='http://pc-schedule-api.k8sprd-wks.k8s.wistron.com/api/'
    this.httpOptions
    // this.ROOTURL2 = config.host2;
    // this.ROOTURL3 = config.host3;
  }
  get(url: string): any {
    var URL = this.ROOTURL + url;
    var res = this.judgeToken(URL, '', 'get');
    return res;
  }

  // get2(url: string): any {
  //   var URL = this.ROOTURL2 + url;
  //   var res = this.judgeToken(URL, '', 'get');
  //   return res;
  // }

  // get3(url: string): any {
  //   var URL = this.ROOTURL3 + url;
  //   var res = this.judgeToken(URL, '', 'get');
  //   return res;
  // }

  post(url: string, params: any): any {
    var URL = this.ROOTURL + url;
    var res = this.judgeToken(URL, params, 'post');
    return res;
  }

  async judgeToken(URL: any, params: any, type: string) {
    var res: any;
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    if (type == 'get') {
      res = await this.http.get(URL, this.httpOptions).toPromise()
        .then(rs => rs)
        .catch((ex) => {
          const msg = this.getErrorMsg(ex);
          const code = this.getErrorCode(ex);
          // this.message.create('error', msg);
          return {
            status: ex.status,
            result: {
              code: (code == '4000') ? code : 0,
              status: ex.status,
              msg: msg
            }
          };
        });
    }
    else if (type == 'post') {
      res = await this.http.post(URL, params, this.httpOptions).toPromise()
        .then(rs => rs)
        .catch((ex) => {
          const msg = this.getErrorMsg(ex);
          const code = this.getErrorCode(ex);
          // this.message.create('error', msg);
          return {
            status: ex.status,
            result: {
              code: (code == '4000') ? code : 0,
              status: ex.status,
              msg: msg,
            }
          };

        });
    }
    if (res.status == '403') {
      return false;
    } else if (res.result) {
      if (res.result.secret) {
        res.result = res.result.secret;
      }
    }
    return res;
  }

  getErrorMsg(ex) {
    if (ex.hasOwnProperty('error')) {
      return this.getErrorMsg(ex.error);
    } else if (ex.hasOwnProperty('message')) {
      return ex.message;
    } else if (ex.hasOwnProperty('msg')) {
      return ex.msg;
    } else {
      return '';
    }
  }

  getErrorCode(ex) {
    if (ex.hasOwnProperty('error')) {
      return this.getErrorCode(ex.error);
    } else if (ex.hasOwnProperty('code')) {
      return ex.code;
    } else {
      return '';
    }
  }
}

