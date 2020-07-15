import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardSetsComponent } from './board-sets.component';

describe('BoardSetsComponent', () => {
  let component: BoardSetsComponent;
  let fixture: ComponentFixture<BoardSetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardSetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
