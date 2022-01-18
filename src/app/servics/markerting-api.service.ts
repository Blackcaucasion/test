import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseURL } from "./contsants"
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MarkertingAPIService {
  private campaignsURL = `${baseURL}/marketing/campaigns/fibre?channels=120&visibility=public`;


  public campaigns: any;

  constructor(private http: HttpClient) { }
  public getCampaigns() {

    return this.http.get<any>(this.campaignsURL).pipe(
      map(res => res["campaigns"]),
      shareReplay()
    );
  }
  public getPromoCodes(promocodes: any) {

    let promcodeProductsURL = `${baseURL}/marketing/products/promos/${promocodes.join(
      ','
    )}?sellable_online=true`
    return this.http.get<any>(promcodeProductsURL).pipe(
      shareReplay()
    )
  }

}
