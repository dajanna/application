import { Proizvod } from "./proizvod";

export class Stavke {
    itemsID?:number;

    productID: number | null; // može biti broj ili null
    kolicina: number | null;   // može biti broj ili null
    total: number | null;      // može biti broj ili null
    price: number | null;      
    billID?:number;
    productDetails?: Proizvod; // 

   
}
