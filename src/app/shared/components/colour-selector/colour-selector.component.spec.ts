import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourSelectorComponent } from './colour-selector.component';

describe('ColourSelectorComponent', () => {
  let component: ColourSelectorComponent;
  let fixture: ComponentFixture<ColourSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColourSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColourSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
