import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Nd2TutorialComponent } from './nd2-tutorial.component';

describe('Nd2TutorialComponent', () => {
  let component: Nd2TutorialComponent;
  let fixture: ComponentFixture<Nd2TutorialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Nd2TutorialComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Nd2TutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
