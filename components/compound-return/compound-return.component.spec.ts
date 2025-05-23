import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompoundReturnComponent } from './compound-return.component';

describe('CompoundReturnComponent', () => {
  let component: CompoundReturnComponent;
  let fixture: ComponentFixture<CompoundReturnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompoundReturnComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompoundReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
