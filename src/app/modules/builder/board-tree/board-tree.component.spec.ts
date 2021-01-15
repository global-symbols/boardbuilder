import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoardTreeComponent } from './board-tree.component';

describe('BoardTreeComponent', () => {
  let component: BoardTreeComponent;
  let fixture: ComponentFixture<BoardTreeComponent>;

  beforeEach(waitForAsync(() => {
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
