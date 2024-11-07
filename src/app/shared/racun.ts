import { StatusID } from "../status";
import { Status } from "./status";
import { Stavke } from "./stavke";

export class Racun {
    billID? :number;
    price:number;
    date:Date;
    statusId?:number;
    stavke?: Stavke[]; 
    status?: Status
    statusName?: string;
}
