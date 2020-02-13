import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardsetListComponent } from './boardset-list.component';

describe('BoardsetListComponent', () => {
  let component: BoardsetListComponent;
  let fixture: ComponentFixture<BoardsetListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardsetListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardsetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
