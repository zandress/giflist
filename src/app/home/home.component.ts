import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { BehaviorSubject, combineLatest, map, startWith } from 'rxjs';
import { RedditService } from '../shared/data-access/reddit/reddit.service';
import { Gif } from '../shared/interfaces/gif';
import { GifListComponentModule } from './ui/gif-list.component';
import { SearchBarComponentModule } from './ui/search-bar.component';
import { SettingsComponentModule } from '../settings/settings.component';
import { HomeStore } from './data-access/home.store';
import { SettingsService } from '../shared/data-access/settings.service';

@Component({
  selector: 'app-home',
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <ion-header>
        <ion-toolbar color="primary">
          <app-search-bar
            [subredditFormControl]="store.subredditFormControl"
          ></app-search-bar>
          <ion-buttons slot="end">
            <ion-button
              id="settings-button"
              (click)="store.settingsModalIsOpen$.next(true)"
            >
              <ion-icon slot="icon-only" name="settings"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <ion-progress-bar
          color="dark"
          *ngIf="vm.isLoading"
          type="indeterminate"
          reversed="true"
        ></ion-progress-bar>
      </ion-header>
      <ion-content>
        <app-gif-list
          *ngIf="store.gifs$ | async as gifs"
          [gifs]="gifs"
          (gifLoadStart)="store.setLoading($event)"
          (gifLoadComplete)="store.setLoadingComplete($event)"
        ></app-gif-list>
        <ion-infinite-scroll
          threshold="100px;"
          (ionInfinite)="loadMore($event, vm.gifs)"
        >
          <ion-infinite-scroll-content
            loadingSpinner="bubbles"
            loadingText="Fetching gifs..."
          >
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
        <ion-popover
          trigger="settings-button"
          [isOpen]="vm.modalIsOpen"
          (ionPopoverDidDismiss)="store.settingsModalIsOpen$.next(false)"
        >
          <ng-template>
            <app-settings></app-settings>
          </ng-template>
        </ion-popover>
      </ion-content>
    </ng-container>
  `,
  styles: [
    `
      ion-infinite-scroll-content {
        margin-top: 20px;
      }

      ion-buttons {
        margin: auto 0;
      }
    `,
  ],
  providers: [HomeStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(
    public store: HomeStore,
    public redditService: RedditService,
    private settingsService: SettingsService
  ) {}

  vm$ = combineLatest([
    this.store.gifs$.pipe(startWith([])),
    this.settingsService.settings$,
    this.redditService.isLoading$,
    this.store.settingsModalIsOpen$,
  ]).pipe(
    map(([gifs, settings, isLoading, modalIsOpen]) => ({
      gifs,
      settings,
      isLoading,
      modalIsOpen,
    }))
  );

  loadMore(ev: Event, currentGifs: Gif[]) {
    this.redditService.nextPage(ev, currentGifs[currentGifs.length - 1].name);
  }
}

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    IonicModule,
    GifListComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
    ]),
    SearchBarComponentModule,
    SettingsComponentModule,
  ],
})
export class HomeComponentModule {}
