import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInvalidComponent } from './dialog-invalid.component';

describe('DialogInvalidComponent', () => {
  let component: DialogInvalidComponent;
  let fixture: ComponentFixture<DialogInvalidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogInvalidComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogInvalidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
