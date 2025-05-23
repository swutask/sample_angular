import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreedomNumberComponent } from './freedom-number.component';

describe('FreedomNumberComponent', () => {
  let component: FreedomNumberComponent;
  let fixture: ComponentFixture<FreedomNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreedomNumberComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreedomNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
