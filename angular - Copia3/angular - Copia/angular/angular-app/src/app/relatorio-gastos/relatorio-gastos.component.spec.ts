import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioGastosComponent } from './relatorio-gastos.component';

describe('RelatorioGastosComponent', () => {
  let component: RelatorioGastosComponent;
  let fixture: ComponentFixture<RelatorioGastosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioGastosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RelatorioGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
