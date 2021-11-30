import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

class ConfigureAsset {
  path: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})

export class DataSourceService {

  private configure: any;

  constructor(public http: HttpClient) {
    this.configure = {};
  }

  public getSpecificConfigure(type: string): any {
    return this.configure[type];
  }

  public loadConfigure(assets: ConfigureAsset[]): Promise<boolean> {
    let assetsCount = 0;
    return new Promise<boolean>((resolve, reject) => {
      assets.forEach(async (asset) => {
        this.configure[asset.type] = await this.http.get<any>(asset.path)
          .toPromise();
        assetsCount++;
        if (assetsCount === assets.length) {
          resolve(true);
        }
      });
    });
  }


}
