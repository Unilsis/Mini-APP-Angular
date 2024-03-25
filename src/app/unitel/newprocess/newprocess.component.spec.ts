import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewprocessComponent } from './newprocess.component';

describe('NewprocessComponent', () => {
  let component: NewprocessComponent;
  let fixture: ComponentFixture<NewprocessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewprocessComponent]
    });
    fixture = TestBed.createComponent(NewprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
