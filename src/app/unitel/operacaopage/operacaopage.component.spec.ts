import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacaopageComponent } from './operacaopage.component';

describe('OperacaopageComponent', () => {
  let component: OperacaopageComponent;
  let fixture: ComponentFixture<OperacaopageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperacaopageComponent]
    });
    fixture = TestBed.createComponent(OperacaopageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
