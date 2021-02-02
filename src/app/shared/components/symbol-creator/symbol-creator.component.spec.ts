import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SymbolCreatorComponent} from './symbol-creator.component';

describe('SymbolCreatorComponent', () => {
  let component: SymbolCreatorComponent;
  let fixture: ComponentFixture<SymbolCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SymbolCreatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SymbolCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
