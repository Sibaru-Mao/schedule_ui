import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpService, private http2: HttpClient) { }

  async get_machine_types() {
    return (await this.http.get('machine_types/getMachineType')).res
  }

  async get_machine_capacity() {
    return (await this.http.get('machine_types/getMachineCapacity')).res
  }

  //获取请求范围內线体的机种数量
  async get_machine_data(date) {
    return (await this.http.get('/machine_types/getMachinePlant?date='+JSON.stringify(date))).res 
    // +JSON.stringify(date)
  }

  //修改本周线体数据
  async change_machine_data(data,date) {
    return (await this.http.get('/machine_types/changeMachinePlant?data='+JSON.stringify(data)+'&date='+JSON.stringify(date))).res 
  }
}
