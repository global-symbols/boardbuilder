import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardTreeComponent } from './board-tree.component';

describe('BoardTreeComponent', () => {
  let component: BoardTreeComponent;
  let fixture: ComponentFixture<BoardTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
