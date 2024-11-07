import { Component } from '@angular/core';
import { RacunService } from '../../servicess/racun.service';
import { NgForm } from '@angular/forms';
import { Racun } from '../../shared/racun';
import { Proizvod } from '../../shared/proizvod';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BillsItemsComponent } from '../bills-items/bills-items.component';
import { BillsDialogComponent } from '../../bills-dialog/bills-dialog.component';
import { StRacDto } from '../../shared/st-rac-dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrl: './bill.component.css'
})
export class BillComponent {
  searchName: string = '';
  sort: string = '';
  currentBillId: number; 
  isProductListVisible: boolean = false;
  selectedQuantity: number;
  selectedProductId: number;
  products: Proizvod[] = [];
  loading = false;
  racuns: Racun[] = [];
  showDetails: boolean=false;
  racunId:number;
  productsDataSource = new MatTableDataSource(this.products);
  dataSource = new MatTableDataSource(this.racuns);
  displayedColumns: string[] = ['billID', 'price', 'date', 'statusName', 'akcije'];
  productDisplayedColumns: string[] = ['productId', 'name', 'price']; 
  constructor(private racunservice: RacunService, private router: Router,
    private dialog: MatDialog, private snackBar: MatSnackBar, private http: HttpClient ) { }

    showRacunDetails(racunId: number) {
      console.log('Otvaram dijalog sa racunId:', racunId); // Dodaj ovo
      const dialogRef = this.dialog.open(BillsDialogComponent, {
        panelClass: 'custom-dialog-container',
        data: { racunId: racunId }
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getAllData();
        }
      });
    }
   
  onRacunConfirm(prikaz: boolean) {
    this.showDetails = prikaz;

    if (!prikaz) {
      this.getAllData(); 
    }
  }
 
  getAllData() {
    return this.racunservice.getAll().subscribe((data) => {
      this.racuns = data;
      this.dataSource.data = this.racuns;
      this.sortByDate(); // Sortiranje računa po datumu nakon dobijanja podataka
    });
  }

  sortByDate() {
    this.dataSource.data = this.dataSource.data.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // Opadajuće sortiranje
    });
  }
getById(id:number){
  this.racunservice.getRacunById(id);
}
ngOnInit() {
  this.getAllData();
  this.getProducts(); 
}
getProducts() {
  this.racunservice.getProducts().subscribe(products => {
    this.products = products; 
    this.productsDataSource.data = this.products;
  })
}
removeBill(bill: any) {
  const billId = bill?.billID;
  const statusId = bill?.statusId;

  if (!billId) {
    console.error('Bill ID nije definisan');
    return;
  }

  // Proverite da li je status računa aktivan
  if (statusId !== 2) { // Pretpostavimo da je status 1 = Aktivan
    this.snackBar.open('Račun se može obrisati samo ako je u aktivnom statusu.', 'Zatvori', { duration: 2000 });
    return;
  }

  if (confirm("Da li ste sigurni da želite da obrišete ovaj račun sa svim stavkama?")) {
    this.racunservice.deleteBillWithItems(billId).subscribe(
      () => {
        this.getAllData(); // Osvježite listu računa nakon brisanja
        this.snackBar.open('Račun i stavke su uspešno obrisani', 'Zatvori', { duration: 2000 });
      },
      error => {
        console.error('Greška prilikom brisanja računa:', error);
        this.snackBar.open('Greška prilikom brisanja računa', 'Zatvori', { duration: 2000 });
      }
    );
  }
}
newProductName: string = '';
newProductPrice: number | null = null;
addProduct(): void {
  if (this.newProductName && this.newProductPrice !== null) {
    const newProduct = { 
      name: this.newProductName, 
      price: this.newProductPrice, 
      active: "yes" // ili "no" u zavisnosti od vašeg izbora
    };

    this.http.post('https://localhost:7208/Proizvod/CreateProduct', newProduct).subscribe(
      (response: any) => {
        console.log(response.message); // Prikazuje uspešnu poruku
        this.getProducts(); // Osvježavanje liste proizvoda
        this.newProductName = '';
        this.newProductPrice = null;
      },
      (error) => {
        console.error('Greška pri dodavanju proizvoda', error);
      }
    );
  } else {
    alert('Molimo unesite naziv i cenu proizvoda.');
  }
}

onPriceInput(): void {
  if (this.newProductPrice !== null && this.newProductPrice > 10000) {
    this.newProductPrice = 10000; // Postavlja maksimalnu cenu na 10000
  }
}
statuses: { statusID: number, statusName: string }[] = [
  { statusID: 1, statusName: 'Fiskalizovan' },
  { statusID: 2, statusName: 'Aktivan' },
  { statusID: 3, statusName: 'Neaktivan' }
];
getStatusName(statusId: number): string {
  const status = this.statuses.find(s => s.statusID === statusId);
  return status ? status.statusName : 'Nepoznat status';
}
}


