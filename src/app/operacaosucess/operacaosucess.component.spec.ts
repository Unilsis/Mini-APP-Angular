import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacaosucessComponent } from './operacaosucess.component';

describe('OperacaosucessComponent', () => {
  let component: OperacaosucessComponent;
  let fixture: ComponentFixture<OperacaosucessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OperacaosucessComponent]
    });
    fixture = TestBed.createComponent(OperacaosucessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
