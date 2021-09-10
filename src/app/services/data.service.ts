import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpService, private http2: HttpClient) { }

  async get_machine_types() {
    return (await this.http.get('getMachineType'))
  }

  async get_machine_lines() {
    return (await this.http.get('getMachineLine'))
  }

  async get_machine_capacity(date) {
    return (await this.http.get('getMachineCapacity?date='+JSON.stringify(date)))
  }

  //获取本周线体的机种数量
  async get_machine_data(date) {
    return (await this.http.get('getMachinePlant?date='+JSON.stringify(date)))
    // +JSON.stringify(date)
  }

  //修改请求范围內本周线体数据
  async get_machine_date(data,date) {
    return (await this.http.get('getMachineDate?data='+JSON.stringify(data)+'&date='+JSON.stringify(date)))
  }

  //修改本周线体数据
  async change_machine_data(data,date) {
    return (await this.http.get('changeMachinePlant?data='+JSON.stringify(data)+'&date='+JSON.stringify(date)))
  }
}
