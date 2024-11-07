import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsItemsComponent } from './bills-items.component';

describe('BillsItemsComponent', () => {
  let component: BillsItemsComponent;
  let fixture: ComponentFixture<BillsItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillsItemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillsItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
