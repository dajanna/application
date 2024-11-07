import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RacunService } from '../../servicess/racun.service';
import { Racun } from '../../shared/racun';
import { forkJoin } from 'rxjs';
import { Stavke } from '../../shared/stavke';
import { Status } from '../../shared/status';
import { Proizvod } from '../../shared/proizvod';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StRacDto } from '../../shared/st-rac-dto';


@Component({
  selector: 'app-bills-items',
  templateUrl: './bills-items.component.html',
  styleUrl: './bills-items.component.css'
})
export class BillsItemsComponent
{
  @Input() racunId: number 
  @Output() onClose = new EventEmitter<boolean>();
  constructor( private racunservice: RacunService) { }
  stavke: Stavke[]=[];
  racun:Racun
 


  ngOnInit(): void {
    this.getRacunDetails(); 
  
  }
  status:Status;
  productDetails?: Proizvod;
  getRacunDetails() {
    this.racunservice.getRacunById(this.racunId).subscribe(data => {
      console.log("Racun data:", data); 
  this.racun = data; 
  console.log("Racun objekat:", this.racun);

  this.racunservice.getStavkeByRacunId(this.racunId).subscribe(stavkeData => {
    console.log('Stavke data:', stavkeData);
    if (stavkeData) {
      this.stavke = Array.isArray(stavkeData) ? stavkeData : [stavkeData];
      console.log('Stavke objekat:', this.stavke);
      this.stavke.forEach(stavka => this.calculateTotal(stavka));
      this.updateTotalBill();
    }
       
    });
      this.racunservice.getStatusByBillId(this.racunId).subscribe(statusData => {
        console.log(statusData); 
        this.status = statusData; 
      });
    }, error => {
      console.error('Greška prilikom preuzimanja računa:', error);
    });
  }

  calculateTotal(stavka: Stavke): void {
    stavka.total = stavka.kolicina * stavka.price; 
    this.updateTotalBill(); 
  }

  updateTotalBill(): void {
    this.racun.price = this.stavke.reduce((acc, stavka) => acc + stavka.total, 0);
  }

  close(){
    this.onClose.emit(false);
  }
  
  
}







  

