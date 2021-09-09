import {Component, OnDestroy, OnInit} from '@angular/core';
import {Cell} from '@data/models/cell.model';
import {UserService} from '@data/services/user.service';
import {User} from '@data/models/user.model';
import {ToolbarService} from '@app/services/toolbar.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit, OnDestroy {

  malePreview: Cell;
  femalePreview: Cell;

  loading: boolean;
  savedAt: Date;

  user: User;
  userSubscription: Subscription;

  constructor(
    private userService: UserService,
    private toolbarService: ToolbarService,
    private router: Router
  ) {
    this.malePreview = new Cell({
      image_url: 'assets/images/previews/happy-man.svg'
    });
    this.femalePreview = new Cell({
      image_url: 'assets/images/previews/happy-woman.svg'
    });
  }

  ngOnInit(): void {
    this.loading = true;

    this.userSubscription = this.userService.get().subscribe(user => {
      this.user = user;
      this.loading = false;

      this.malePreview.hair_colour = user.default_hair_colour;
      this.femalePreview.hair_colour = user.default_hair_colour;

      this.malePreview.skin_colour = user.default_skin_colour;
      this.femalePreview.skin_colour = user.default_skin_colour;
    });

    this.toolbarService.setButtons([{
      text: 'Board Sets',
      icon: 'arrow_back',
      action: () => this.router.navigate(['/', 'boardsets'])
    }]);
  }

  ngOnDestroy() {
    // Clear navbar buttons
    this.toolbarService.clearButtons();

    this.userSubscription.unsubscribe();
  }

  updateHair(colour: string) {
    this.user.default_hair_colour = colour;
    this.malePreview.hair_colour = colour;
    this.femalePreview.hair_colour = colour;
  }

  updateSkin(colour: string) {
    this.user.default_skin_colour = colour;
    this.malePreview.skin_colour = colour;
    this.femalePreview.skin_colour = colour;
  }

  save() {
    this.userService.update(this.user).subscribe(user => {
      this.savedAt = new Date();
    });
  }
}
