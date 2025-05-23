import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifestyleNumberComponent } from './lifestyle-number.component';

describe('LifestyleNumberComponent', () => {
  let component: LifestyleNumberComponent;
  let fixture: ComponentFixture<LifestyleNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifestyleNumberComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifestyleNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
