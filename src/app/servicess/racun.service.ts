import { Injectable } from '@angular/core';
import { Racun } from '../shared/racun';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Proizvod } from '../shared/proizvod';
import { Stavke } from '../shared/stavke';
import { Status } from '../shared/status';
import { StRacDto } from '../shared/st-rac-dto';
import { UpdateBillRequest } from '../shared/update-bill-request';
import { LoginModel, SignUpModel } from '../log-in/log-in.component';
import { LoginRequest } from '../interfaces/login-request';
import { AuthResponse } from '../interfaces/auth-response';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../interfaces/decoded-token';
import { RegisterRequest } from '../interfaces/register-request';




@Injectable({
  providedIn: 'root'
})
export class RacunService {

private tokenKey='token'
 url5="https://localhost:7208/Account";
  url="https://localhost:7208/Racun";
  url2="https://localhost:7208/proizvod";
  url3="https://localhost:7208/Stavke";
  url4="https://localhost:7208/Status";
  constructor(private http:HttpClient) { }
 
  logIn(data:LoginRequest): Observable<AuthResponse>{

    return this.http.post<AuthResponse>(`${this.url5}/login`, data).pipe(
      map((response)=>{
          if(response.isSuccess){
            localStorage.setItem(this.tokenKey, response.token);
          }
          return response;
      })
    )

  }
  register(data:RegisterRequest): Observable<AuthResponse>{

    return this.http.post<AuthResponse>(`${this.url5}/register`, data)
    

  }
  getUserDetail = () => {
    const token = this.getToken();
    if (!token) return null;
  
    // Dekodiramo token i mapiramo ga na naš tip DecodedToken
    const decodedToken = jwtDecode<DecodedToken>(token);
  
    const UserDetail = {
      id: decodedToken.nameid,   // 'nameid' je sada prepoznat jer imamo DecodedToken
      fullName: decodedToken.name, 
      email: decodedToken.email, 
      role: decodedToken.role || []
    };
  
    return UserDetail;
  };
  IsLoggedIn=() : boolean=>{
    const token=this.getToken();
    if(!token) return false;
    return !this.IsTokenExpired();
  }
  private IsTokenExpired() {
    const token=this.getToken();
    if(!token) return true;
    const decoded=jwtDecode(token);
    const IsTokenExpired=Date.now() >= decoded['exp']! *1000;
    if(IsTokenExpired) this.logOut();
    return IsTokenExpired;
  }
  logOut = (): void => {
    localStorage.removeItem(this.tokenKey);
    // Navigacija nazad na login nakon uklanjanja tokena
    window.location.href = '/login';
  }
  private getToken = ():string|null => localStorage.getItem (this.tokenKey) || "";
  deleteBillWithItems(billId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/delete/${billId}`);
  }
  getStatusList(): Observable<Status[]> {
    return this.http.get<Status[]>(this.url4	);
  }

  getAll():Observable<Racun[]>{
    return this.http.get<Racun[]>(this.url)
  }
  getProductsByStavkeId(stavkaId: number): Observable<Proizvod[]> {
    return this.http.get<Proizvod[]>(`${this.url3	}/${stavkaId}`);
  }
getRacunById(billId:number){
  return this.http.get<Racun>(`${this.url}/${billId}`)
}
 
  getStavkeByRacunId(billId: number): Observable<Stavke[]> {
    return this.http.get<Stavke[]>(`${this.url}/stavkebybillId/${billId}`);
  }
  
  getStatusByBillId(billId: number): Observable<Status> {
    return this.http.get<Status>(`${this.url}/getstatusbybillid/${billId}`);
  }
 
  getProizvodById(proizvodId: number): Observable<Proizvod> {
    return this.http.get<Proizvod>(`${this.url2}/proizvodi/${proizvodId}`);
  }
  getProizvodiByRacunId(racunId: number): Observable<Proizvod[]> {

    return this.http.get<Proizvod[]>(`${this.url2}/racun/${racunId}/proizvodi`);
}

getProducts(): Observable<Proizvod[]> {
  return this.http.get<Proizvod[]>(this.url2);
}

add(racun:Racun){
  console.log('Dodavanje računa:', racun); 
  return this.http.post(this.url, racun);
}
update(racunId:number, racun:Racun){

  return this.http.put(`${this.url}/${racunId}`, racun);

}
getStatusById(statusId: number): Observable<Status> {
  return this.http.get<Status>(`${this.url4}/${statusId}`); // Pretpostavljamo da vaš API ima ovu rutu
}
addStavke(stavke:Stavke){
  console.log('Dodavanje stavki:', stavke); 
  return this.http.post(this.url3, stavke);
}
updateStavke(stavkeId:number, stavke:Stavke){

  return this.http.put(`${this.url3}/${stavkeId}`, stavke);

}

insertBills(request: StRacDto): Observable<any> {
  return this.http.post<any>(`${this.url}/dodajracun`, request);
}

updateBill(bill: any, billItems: any[]): Observable<any> {
  return this.http.put(`${this.url}/update/${bill.billID}`, { bill, billItems });
}
delete(stavkeId: number): Observable<any> {
  return this.http.delete(`${this.url3}/${stavkeId}`, { responseType: 'text' });
}
updateBillStatus(billId: number, newStatusId: number): Observable<void> {
  return this.http.put<void>(`${this.url}/UpdateStatus/${billId}`, newStatusId);
}

}
