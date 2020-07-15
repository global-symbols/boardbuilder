import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardTreeItemComponent } from './board-tree-item.component';

describe('BoardTreeItemComponent', () => {
  let component: BoardTreeItemComponent;
  let fixture: ComponentFixture<BoardTreeItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardTreeItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardTreeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
