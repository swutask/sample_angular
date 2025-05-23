import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Nd1TutorialComponent } from './nd1-tutorial.component';

describe('Nd1TutorialComponent', () => {
  let component: Nd1TutorialComponent;
  let fixture: ComponentFixture<Nd1TutorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Nd1TutorialComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Nd1TutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
