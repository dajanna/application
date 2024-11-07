import { Racun } from "./racun";

export class Status {
     statusId: number;
     name: string;
 
     constructor(statusId: number, name: string) {
         this.statusId = statusId;
         this.name = name;
     }
 }
 
 export const statusNames: { [key: number]: string } = {
     1: 'Pending',
     2: 'Active',
     3: 'Inactive',
     // Dodajte ostale statuse po potrebi
 };
 
 // Funkcija za dobijanje naziva statusa
 export function getStatusName(statusID: number): string {
     return statusNames[statusID] || 'Unknown Status';
 }