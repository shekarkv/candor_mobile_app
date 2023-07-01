import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';
// import { AppCommon } from '../app.common';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpserviceService {

  readonly baseAppUrl: string = 'https://cbs.ecandor.com/app.php?a=';
  readonly baseUrl: string = 'https://cbs.ecandor.com/';  

  constructor(
    // private appCommon: AppCommon
  ) { }

  public postservice(geturl: any, postParams: any) {
    let url = this.baseAppUrl + geturl;

    const options = {
      method: 'POST',
      url:url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: postParams
    };

    return from(CapacitorHttp.post(options))

  }

  public postserviceWithHeader(geturl: any, postParams: any, header:any) {
    let url = this.baseAppUrl + geturl;

    const options = {
      method: 'POST',
      url:url,
      headers: header,
      data: postParams
    };

    return from(CapacitorHttp.post(options))

  }

  public getservice(geturl: any) {
    let url = this.baseAppUrl + geturl;

    const options = {
      method: 'GET',
      url:url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };

    return from(CapacitorHttp.get(options))

  }
}
