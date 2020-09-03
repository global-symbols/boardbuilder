import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBoardSetDialogComponent } from './new-board-set-dialog.component';

describe('NewBoardSetDialogComponent', () => {
  let component: NewBoardSetDialogComponent;
  let fixture: ComponentFixture<NewBoardSetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBoardSetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBoardSetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
