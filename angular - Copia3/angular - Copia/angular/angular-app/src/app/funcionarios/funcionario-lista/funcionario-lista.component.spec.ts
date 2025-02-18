import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuncionarioListaComponent } from './funcionario-lista.component';

describe('FuncionarioListaComponent', () => {
  let component: FuncionarioListaComponent;
  let fixture: ComponentFixture<FuncionarioListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionarioListaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FuncionarioListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
