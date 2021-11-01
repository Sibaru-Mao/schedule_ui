import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(private http: HttpService, private http2: HttpClient) { }

  /* summary页面请求 */
  async get_machine_types() {
    return (await this.http.get('getMachineType'))
  }

  async get_machine_lines() {
    return (await this.http.get('getMachineLine'))
  }

  async get_machine_capacity(date) {
    return (await this.http.get('getMachineCapacity?date=' + JSON.stringify(date)))
  }

  //获取本周线体的机种数量
  async get_machine_data(date) {
    return (await this.http.get('getMachinePlant?date=' + JSON.stringify(date)))
    // +JSON.stringify(date)
  }

  //修改请求范围內本周线体数据
  async get_machine_date(data, date) {
    return (await this.http.get('getMachineDate?data=' + JSON.stringify(data) + '&date=' + JSON.stringify(date)))
  }

  //修改本周线体数据
  async change_machine_data(data, date) {
    return (await this.http.get('changeMachinePlant?data=' + JSON.stringify(data) + '&date=' + JSON.stringify(date)))
  }


  /* detail页面请求 */
  // async get_machine_detail_all() {
  //   return (await this.http.get('getMachineDetailAll'))
  // }

  async get_machine_detail(list, date) {
    return (await this.http.get('getMachineDetail?list=' + JSON.stringify(list) + '&date=' + JSON.stringify(date)))
  }

  async change_machine_detail(data) {
    return (await this.http.get('changeMachineDetail?data=' + JSON.stringify(data)))
  }

  async delete_machine_detail(id) {
    console.log(id);
    return (await this.http.post('deleteMachineDetail' , {data:id}))
  }

  async excel_machine_detail(item) {
    return (await this.http.post('excelToSql', { data: item }))
  }

  /* maintenance页面请求 */
  async show_maintenance() {
    return (await this.http.get('showMaintenance'))
  }

  async change_maintenance(item) {
    return (await this.http.post('changeMaintenance', { data: item }))
  }

  async show_personnel() {
    return (await this.http.get('showPersonnel'))
  }

  async change_personnel(item,bool) {
    return (await this.http.post('changePersonnel', { data: item,status:bool }))
  }

  /* 人员信息 */
  async permission(user) {
    return (await this.http.get('getPermission?user=' + JSON.stringify(user)))
  }

  async show_people(man) {
    return (await this.http.get2('http://webap01.wks.wistron.com.cn:13015/api/Idlwwhrs?filter={"where":{"and":[{"EMPLID":' + JSON.stringify(man)+'}]}}'))
  }
}
