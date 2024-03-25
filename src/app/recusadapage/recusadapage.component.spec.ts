import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecusadapageComponent } from './recusadapage.component';

describe('RecusadapageComponent', () => {
  let component: RecusadapageComponent;
  let fixture: ComponentFixture<RecusadapageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecusadapageComponent]
    });
    fixture = TestBed.createComponent(RecusadapageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
