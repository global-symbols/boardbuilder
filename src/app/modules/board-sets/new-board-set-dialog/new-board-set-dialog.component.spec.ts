import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewBoardSetDialogComponent } from './new-board-set-dialog.component';

describe('NewBoardSetDialogComponent', () => {
  let component: NewBoardSetDialogComponent;
  let fixture: ComponentFixture<NewBoardSetDialogComponent>;

  beforeEach(waitForAsync(() => {
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
