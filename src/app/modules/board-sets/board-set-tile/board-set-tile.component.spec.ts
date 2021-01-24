import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BoardSetTileComponent} from './board-set-tile.component';

describe('BoardSetTileComponent', () => {
  let component: BoardSetTileComponent;
  let fixture: ComponentFixture<BoardSetTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardSetTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardSetTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
