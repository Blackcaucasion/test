import { Component, OnInit } from '@angular/core';
import { filter, first } from 'rxjs/operators';
import { MarkertingAPIService } from 'src/app/servics/markerting-api.service';
import { providersInfo, priceRanges } from '../../servics/contsants';

interface iPriceRanges{

  min: number,
  max: number,
  label: string
}
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
  public selectedPriceRangeLabels: iPriceRanges = {min:0,max:0,label:"Price"};

  constructor(private readonly markertingAPIService: MarkertingAPIService) { }

  ngOnInit(): void {
    // get campain data
    this.markertingAPIService.getCampaigns().subscribe((data) => {
      this.campaings = data;

    }
    );
  }
  public valurChange(event: any) {
    this.promocodes = this.filterCampaings(event);

    //get summarized Products from promo codes
    this.markertingAPIService.getPromoCodes(this.promocodes.promocodes).subscribe((data) => {

      this.promocodeProducts = data;

      this.summarizedProducts = this.promocodeProducts.reduce((prods: any, pc: any) => [...prods, ...this.getProductsFromPromo(pc)], [])

      this.providers = [...new Set(this.summarizedProducts?.map(p => p.provider))]
    })

  }
  public getProductsFromPromo = (pc: any) => {
  
    return pc.products.reduce((prods: any, p: any) => [...prods, this.getSummarizedProduct(p)], [])
  }
  public getSummarizedProduct = ({ productCode, productName, productRate, subcategory }: any) => {
    const provider = subcategory.replace('Uncapped', '').replace('Capped', '').trim()
    return { productCode, productName, productRate, provider }
  }

  public filterCampaings(codes: any) {
    return this.campaings.filter((c: { code: any; }) => c.code === codes)[0]

  }
  public changeSelection(provider: string, event: any) {

    if (event.checked) {
      this.selectedProvidersSets.add(provider)
    }
    else {
      this.selectedProvidersSets?.delete(provider)
    }

    this.displayProducts()

  }
  public displayProducts() {
    // filter products by infrastructure provider
    const selectedProviderSet = new Set(this.selectedProvidersSets)
    this.selectedProducts = this.summarizedProducts?.filter(p => selectedProviderSet.has(p.provider))

    // filter products by price range
    this.selectedProducts = this.selectedProducts?.filter(this.filterByPriceRanges)

    // sort by price from lowest to highest
    this.selectedProducts = this.selectedProducts?.sort((pa: { productRate: number; }, pb: { productRate: number; }) => pa.productRate - pb.productRate)
    // update obj to have image info
    if(this.selectedProducts?.length > 0){

    for(let selectedProds of this.selectedProducts){
    let providerName=  providersInfo.filter( name=>name.name == selectedProds.provider)
    selectedProds ={
      ...selectedProds,
      providerName
    }
   let tempVal = this.selectedProducts?.findIndex((x: any)=>x.productCode == selectedProds.productCode)
       this.selectedProducts[tempVal]= selectedProds;
    };
  }

    return this.selectedProducts
  }
  selectedPriceRanges(){
    return priceRanges.filter(range => 
      this.selectedPriceRangeLabels?.label == range.label ? true:false
    )
  }
 
   public filterByPriceRanges = (product: any) => {
 
    // If no price range has been selected then include all products
    if (this.selectedPriceRanges().length === 0) {
      return true
    }

    for (const range of this.selectedPriceRanges()) {
      const price = product.productRate
      if (price >= range.min && price <= range.max) {
        return true
      }
    }

    return false
  }
  pricesFilter(event: any) {
    this.selectedPriceRangeLabels = JSON.parse(event.target.value)
    this.displayProducts()


  }
}
