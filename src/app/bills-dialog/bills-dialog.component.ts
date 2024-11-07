import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { Racun } from '../shared/racun';
import { RacunService } from '../servicess/racun.service';
import { getStatusName, Status, statusNames } from '../shared/status';
import { Stavke } from '../shared/stavke';
import { StRacDto } from '../shared/st-rac-dto';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { UpdateBillRequest } from '../shared/update-bill-request';
import { Proizvod } from '../shared/proizvod';

import { StatusID } from '../status';
import { statuses } from '../statuses';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-bills-dialog',
  templateUrl: './bills-dialog.component.html',
  styleUrl: './bills-dialog.component.css'
})
export class BillsDialogComponent {

racun: Racun = { billID: 0, price: 0, date: new Date(), statusId: null};
  stavke: Stavke[] = [{ itemsID: 0, productID: null, kolicina: null, total: null, price: null }];
  isEditMode: boolean;
  products: Proizvod[] = []; 
  bill:Racun
  stavka:Stavke 
  stavka1: { productID: number | null } = { productID: null }; 

  constructor(
    public dialogRef: MatDialogRef<BillsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { racunId: number },
    private racunService: RacunService,
    private snackBar: MatSnackBar
  ) {
    this.isEditMode = data.racunId !== 0;
    this.stavka1 = { productID: null };
  }
  logProductId(stavka: Stavke) {
    console.log('Odabrani proizvod ID:', stavka.productID);
  }
  stavkee = {
    productID: 0 
  };
  
//   onProductChange(event: Event, index: number): void {
//     const selectedProductID = +(event.target as HTMLSelectElement).value;
//     const selectedProduct = this.products.find(p => p.productID === selectedProductID);

//     if (selectedProduct) {
//         // Kopiramo stavku kako bismo sprečili neželjene promene u drugim stavkama
//         this.stavke = this.stavke.map((stavka, i) => 
//             i === index ? { ...stavka, productID: selectedProductID, price: selectedProduct.price,  kolicina: 1 } : stavka
//         );
//         this.calculateTotal(this.stavke[index]); // Ažurira total za tu stavku
//     }
//     console.log(`Izmenjena stavka za indeks ${index}:`, JSON.stringify(this.stavke[index]));
// }
onProductChange(event: MatSelectChange, index: number): void {
  const selectedProductId = event.value; // Izvlačimo ID iz događaja

  // Pronađite izabrani proizvod
  const selectedProduct = this.products.find(product => product.productID === selectedProductId);

  if (selectedProduct) {
    // Ažurirajte stavku sa detaljima izabranog proizvoda
    this.stavke[index].productDetails = selectedProduct;
    this.stavke[index].price = selectedProduct.price;
    this.stavke[index].kolicina = 1;// Ako želite da postavite cenu
    // Možete dodati dodatne atribute ako su potrebni
  }
}

statuses: Status[] = [
  new Status(1, 'Fiscalized'),
  new Status(2, 'Active'),
  new Status(3, 'Inactive')
  // Dodajte ostale statuse po potrebi
];
onStatusChange(event: any) {
  const newStatusId = event.value;
  if (this.racun.statusId !== newStatusId) {
    this.racunService.updateBillStatus(this.racun.billID, newStatusId).subscribe({
      next: () => {
        this.racun.statusId = newStatusId;
        console.log('Status uspešno ažuriran.');
      },
      error: (err) => {
        console.error('Greška prilikom ažuriranja statusa:', err);
      }
    });
  }
}






ngOnInit(): void {
  this.loadProducts();
  if (this.isEditMode) {
    this.loadRacunAndStavke();
  } else {
    
    this.racun.statusId = 2; 
  }
}

  
  loadProducts() {
    this.racunService.getProducts().subscribe(products => {
      this.products = products; 
      console.log('Učitani proizvodi:', this.products);
    }, error => {
      console.error('Greška prilikom dobijanja proizvoda:', error);
    });
  }
  
  loadRacunAndStavke() {
    forkJoin({
      racun: this.racunService.getRacunById(this.data.racunId),
      stavke: this.racunService.getStavkeByRacunId(this.data.racunId)
    }).subscribe(({ racun, stavke }) => {
      console.log('Dobijeni racun:', racun);
      console.log('Dobijene stavke:', stavke);
      this.racun = racun;
  
     const statusName = statusNames[this.racun.statusId]; // Use statusId here
     this.racun.statusName = statusName ? statusName : 'Unknown Status';

     // Log the mapped status name
     console.log('Status Name:', this.racun.statusName); 
  
    
      this.stavke = stavke.map(stavka => ({
        ...stavka,
        
        productID: stavka.productID || null
        
      }));
      this.updateTotalPrice(); 
    }, (error) => {
      console.error('Greška prilikom dobijanja podataka:', error);
    });
  }
  
//   addStavka() {
//     const novaStavka: Stavke = { 
//         itemsID: 0,
//         productID: null, 
//         kolicina: 0, 
//         total: 0, 
//         price: 0 
//     };
//     this.stavke.push(novaStavka);
//     console.log("Dodavanje nove stavke:", novaStavka);
// }
addStavka() {
  // Proverava da li je račun "Inactive" ili "Fiscalized"
  if (this.racun.statusId === 1 || this.racun.statusId === 3) { // 1 = Fiscalized, 3 = Inactive
      this.snackBar.open('Ne možete dodavati stavke na račune koji su Inactive ili Fiscalized.', 'Zatvori', { duration: 3000 });
      return; // Prekida funkciju ako račun nije Active
  }

  const currentStavka = this.stavke[this.stavke.length - 1]; // Dobij poslednju stavku

  // Proverava da li su svi potrebni podaci popunjeni
  if (!currentStavka.productID || !currentStavka.kolicina || !currentStavka.price) {
      this.snackBar.open('Morate popuniti sve potrebne informacije za trenutnu stavku pre nego što dodate novu.', 'Zatvori', { duration: 3000 });
      return; // Prekida funkciju ako nisu popunjeni svi podaci
  }

  // Kreiraj novu stavku i dodaj je u niz
  const novaStavka: Stavke = { 
      itemsID: 0,
      productID: null, 
      kolicina: 0, 
      total: 0, 
      price: 0 
  };
  this.stavke.push(novaStavka);
  console.log("Dodavanje nove stavke:", novaStavka);
}

// removeStavka(index: number) {
//   if (this.stavke.length > 1) {
//     // Proverava da li je status računa "Aktivan"
//     if (this.racun.statusId === 2) { // Pretpostavljamo da je 2 ID za "Aktivan"
//       // Prikazivanje potvrde pre brisanja
//       if (confirm("Da li ste sigurni da želite da obrišete ovu stavku?")) {
//         const stavkaToDelete = this.stavke[index]; // Dobijamo stavku koja treba da se obriše

//         // Pozivanje servisa za brisanje
//         this.racunService.delete(stavkaToDelete.itemsID).subscribe(
//           () => {
//             // Ukloni stavku iz lokalnog niza
//             this.stavke.splice(index, 1);
//             this.updateTotalPrice(); // Ažurirajte ukupnu cenu nakon brisanja
//             this.snackBar.open('Stavka uspešno obrisana', 'Zatvori', { duration: 2000 });
//           },
//           error => {
//             console.error('Greška prilikom brisanja stavke:', error);
//             this.snackBar.open('Greška prilikom brisanja stavke', 'Zatvori', { duration: 2000 });
//           }
//         );
//       }
//     } else {
//       this.snackBar.open('Možete obrisati stavke samo za račune sa statusom ACTIVE', 'Zatvori', { duration: 2000 });
//     }
//   }
// }
removeStavka(index: number) {
  const stavkaToDelete = this.stavke[index];

  // Provera da li stavka ima `itemsID`, ako ne, samo je uklonite iz niza
  if (!stavkaToDelete.itemsID) {
    this.stavke.splice(index, 1);
    this.updateTotalPrice(); // Ažurirajte ukupnu cenu nakon brisanja
    this.snackBar.open('Stavka uspešno uklonjena', 'Zatvori', { duration: 2000 });
    return;
  }

  // Ako stavka ima `itemsID`, šaljemo zahtev serveru
  if (this.racun.statusId === 2) { // Provera da li je status ACTIVE
    if (confirm("Da li ste sigurni da želite da obrišete ovu stavku?")) {
      this.racunService.delete(stavkaToDelete.itemsID).subscribe(
        () => {
          this.stavke.splice(index, 1);
          this.updateTotalPrice(); // Ažurirajte ukupnu cenu nakon brisanja
          this.snackBar.open('Stavka uspešno obrisana', 'Zatvori', { duration: 2000 });
        },
        error => {
          console.error('Greška prilikom brisanja stavke:', error);
          this.snackBar.open('Greška prilikom brisanja stavke', 'Zatvori', { duration: 2000 });
        }
      );
    }
  } else {
    this.snackBar.open('Možete obrisati stavke samo za račune sa statusom ACTIVE', 'Zatvori', { duration: 2000 });
  }
}

  
  
  Add() {
  
    if (this.racun.billID === 0) {
      this.racun.statusId = 2; 
    } 
  
    const request: StRacDto = {
      bills: [this.racun], 
      billItems: this.stavke 
    };
   
    console.log("Podaci koje šaljemo na čuvanje:", JSON.stringify(request));
    this.racunService.insertBills(request).subscribe(
      response => {
        console.log('Uspešno dodat račun:', response);
        this.snackBar.open('Račun uspešno dodat', 'Zatvori', { duration: 2000 });
        this.dialogRef.close(true); 
      },
      error => {
        console.error('Greška prilikom dodavanja računa:', error);
        this.snackBar.open('Greška prilikom dodavanja računa', 'Zatvori', { duration: 2000 });
      }
    );
  }
  

 
  update() {
    const billID = this.racun.billID;
    console.log('Stavke pre ažuriranja:', JSON.stringify(this.stavke));
  
   
    this.racunService.updateBill(this.racun, this.stavke.map(stavka => ({
      ...stavka,
      productID: stavka.productID  
    }))).subscribe(
      response => {
        console.log('Uspešno ažuriran račun:', response);
        this.snackBar.open('Račun uspešno ažuriran', 'Zatvori', { duration: 2000 });
        this.dialogRef.close(true); 
      },
      error => {
        console.error('Greška prilikom ažuriranja računa:', error);
        console.error('Detalji greške:', error.error); 
        this.snackBar.open('Greška prilikom ažuriranja računa', 'Zatvori', { duration: 2000 });
      }
    );
  }
 
  save() {
    if (this.racun.billID > 0) { 
        if (this.racun.statusId === 2) { 
            this.update();
        } else {
            this.snackBar.open('Možete izmeniti samo račune sa statusom ACTIVE', 'Zatvori', { duration: 2000 });
        }
    } else {
        this.Add(); // Poziva Add() bez provere statusa za novi račun
    }
}
  cancel() {
    this.dialogRef.close(false);
  }
  private updateTotalPrice(): void {
    const total = this.stavke.reduce((sum, stavka) => {
      return sum + (stavka.total || 0);
    }, 0);
    this.racun.price = total; 
  }

 
  calculateTotal(stavka: Stavke): void {
    if (stavka.price && stavka.kolicina) {
      stavka.total = stavka.price * stavka.kolicina; // Izračunaj total
    } else {
      stavka.total = 0; // Ako nije uneta cena ili količina, postavi total na 0
    }
    this.updateTotalPrice(); 
  }
  setQuantity(stavka: Stavke, event: Event): void {
    const input = event.target as HTMLInputElement; 
    const quantity = Number(input.value); 
  
    
    if (quantity < 0) {
      stavka.kolicina = 0; 
      input.value = String(stavka.kolicina); 
    } else if (quantity > this.maxQuantity) {
      stavka.kolicina = this.maxQuantity; 
      input.value = String(stavka.kolicina); 
    } else {
      stavka.kolicina = quantity; 
    }
  
    this.calculateTotal(stavka); 
  }
  
  
  maxQuantity = 99999999; 
  getProductName(productID: number): string {
    const proizvod = this.products.find(prod => prod.productID === productID);
    return proizvod ? proizvod.name : 'Nepoznato'; // Vraća ime proizvoda ili 'Nepoznato' ako nije pronađen
  }
 
 
}
 

