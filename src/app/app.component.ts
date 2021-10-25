import { Component, OnInit, Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import * as results from '../assets/results.json';

interface Data {
  Adults: string;
  ArrDate: string;
  ArrGateWay: string;
  ArrStationCode: string;
  ArrStationCodeFull: string;
  ArrTime: string;
  BeforeAfterAt: string;
  BookingPolicy: string;
  BookingPolicyDesc: string;
  BookingReason: string;
  BookingRef: string;
  Children: string;
  Co2Produced: string;
  Currency: string;
  DateStored: string;
  DepDate: string;
  DepGateWay: string;
  DepStationCode: string;
  DepStationCodeFull: string;
  DepTime: string;
  DiscountADT: string;
  DiscountBKG: string;
  DiscountCHD: string;
  DiscountGRP: string;
  DiscountID: string;
  DiscountRule: string;
  DiscountVoucherCodesApplied: string;
  DistanceTravelled: string;
  ErrorStatus: string;
  ExtraTimeToChange: string;
  Format: string;
  Icons: string;
  Infants: string;
  Legs: Array<any>;
  MaxClass: string;
  MinAdultPrice: string;
  MinChildPrice: string;
  Operator: string;
  OperatorPri: number;
  OutBoundLegs: string;
  OutBoundUid: string;
  RecNum: string;
  RecType: string;
  RequestType: string;
  ReturnArrDate: string;
  ReturnArrTime: string;
  ReturnDepDate: string;
  ReturnDepTime: string;
  ReturnLegs: string;
  ReturnUid: string;
  ScanDate: string;
  ScanTime: string;
  SingleOrReturn: string;
  Source: string;
  Split: string;
  Supplier: string;
  TotalStops: string;
  UserRef: string;
  Via: string;
  apiRecNum: string;
}
  
export type SortColumn = keyof Data | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

export interface SortEvent {
    column: SortColumn;
    direction: SortDirection;
}

@Directive({
    selector: 'th[sortable]',
    host: {
        '[class.asc]': 'direction === "asc"',
        '[class.desc]': 'direction === "desc"',
        '(click)': 'rotate()'
    }
})

export class NgbdSortableHeader {

    @Input() sortable: SortColumn = '';
    @Input() direction: SortDirection = '';
    @Output() sort = new EventEmitter<SortEvent>();

    rotate() {
        this.direction = rotate[this.direction];
        this.sort.emit({column: this.sortable, direction: this.direction});
    }
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'sabs-travel';
    data: Data[];
    DepTimeDir = true;
    ArrTimeDir = true;
    MinAdultPriceDir = true;
    MinChildPriceDir = true;

    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

    ngOnInit() {
        const stringified = JSON.stringify(results);
        const parsedData = JSON.parse(stringified);
        this.data = parsedData.default; // array
        console.log('data: ', this.data);
    }

    sort(column: any, dir: any) {
      if(column == 'DepTime') {
        this.DepTimeDir = !this.DepTimeDir;
      } else if(column == 'ArrTime') {
        this.ArrTimeDir = !this.ArrTimeDir;
      } else if(column == 'MinAdultPrice') {
        this.MinAdultPriceDir = !this.MinAdultPriceDir;
      } else {
        this.MinChildPriceDir = !this.MinChildPriceDir;
      }
      let ev: SortEvent = {
        column: column,
        direction: dir
      };
      this.onSort(ev);
    }
    
    onSort({column, direction}: SortEvent) {
        // resetting other headers
        this.headers.forEach(header => {
          if (header.sortable !== column) {
            header.direction = '';
          }
        });
    
        // sorting data
        if (direction === '' || column === '') {
          this.data = this.data;
        } else {
          this.data = [...this.data].sort((a: any, b: any) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
          });
        }
      }
}