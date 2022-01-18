import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { filter, first } from 'rxjs/operators';
import { MarkertingAPIService } from 'src/app/servics/markerting-api.service';
import { providersInfo ,priceRanges } from '../../servics/contsants';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public campaings: any;
  public campainCode: any = "Selected";
  public promocodes: any;
  public summarizedProducts: Array<any> | undefined;
  public promocodeProducts: any;
  public providers: any;
  public selectedProvidersSets = new Set();
  public selectedProducts: any
  public providerInfo: any;
  public priceRange = priceRanges;
  public selectedPriceRangeLabels:any ="Price";
  // public logos:Array<any> = new Array()

  constructor(private readonly markertingAPIService: MarkertingAPIService) { }

  ngOnInit(): void {
    this.markertingAPIService.getCampaigns().subscribe((data) => {
      this.campaings = data;

    }
    );
  }
  public valurChange(event: any) {
    this.promocodes = this.filterCampaings(event);

    this.markertingAPIService.getPromoCodes(this.promocodes.promocodes).subscribe((data) => {

      this.promocodeProducts = data;

      this.summarizedProducts = this.promocodeProducts.reduce((prods: any, pc: any) => [...prods, ...this.getProductsFromPromo(pc)], [])

      this.providers = [...new Set(this.summarizedProducts?.map(p => p.provider))]
    })

  }
  getProductsFromPromo = (pc: any) => {
    const promoCode = pc.promoCode
    return pc.products.reduce((prods: any, p: any) => [...prods, this.getSummarizedProduct(p)], [])
  }
  getSummarizedProduct = ({ productCode, productName, productRate, subcategory }: any) => {
    const provider = subcategory.replace('Uncapped', '').replace('Capped', '').trim()
    return { productCode, productName, productRate, provider }
  }
  filterCampaings(codes: any) {
    return this.campaings.filter((c: { code: any; }) => c.code === codes)[0]

  }
  changeSelection(provider: string, event: any) {

    if (event.checked) {
      this.selectedProvidersSets.add(provider)


    }
    else {
      this.selectedProvidersSets?.delete(provider)
    }

    this.getproviderInfo(provider);
    this.displayProducts()

  }
  displayProducts() {
    // filter products by infrastructure provider
    const selectedProviderSet = new Set(this.selectedProvidersSets)
    this.selectedProducts = this.summarizedProducts?.filter(p => selectedProviderSet.has(p.provider))

    // filter products by price range
    // this.selectedProducts = this.selectedProducts?.filter(this.filterByPriceRanges)

    // sort by price from lowest to highest
    this.selectedProducts = this.selectedProducts.sort((pa: { productRate: number; }, pb: { productRate: number; }) => pa.productRate - pb.productRate)
    return this.selectedProducts
  }
  // to be revisited currently not working
  getproviderInfo(name: any) {

    this.providerInfo = providersInfo.filter(item => item.name.indexOf(name) > -1).map(item => item.url)
  }
  
  pricesFilter(){
//To do

  }
}
