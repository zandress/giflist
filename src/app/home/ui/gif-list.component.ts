import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { Gif } from '../../shared/interfaces';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-gif-list',
  template: `
    <ion-list lines="none">
      <div class="gif" *ngFor="let gif of gifs; trackBy: trackByFn">
        <ion-item button detail="false" (click)="playVideo($event, gif)">
          <ion-spinner color="light" *ngIf="gif.loading"></ion-spinner>
          <div
            [style.background]="
              'url(' + gif.thumbnail + ') 50% 50% / cover no-repeat'
            "
            [ngStyle]="
              !gif.dataLoaded
                ? {
                    filter: 'blur(3px) brightness(0.6)',
                    transform: 'scale(1.1)'
                  }
                : {}
            "
            class="preload-background"
          >
            <video
              playsInline
              poster="none"
              preload="none"
              [loop]="true"
              [muted]="true"
              [src]="gif.src"
            ></video>
          </div>
          <ion-label>{{ gif.title }}</ion-label>
        </ion-item>
        <ion-list-header>
          <ion-label> {{ gif.title }} </ion-label>
          <ion-button (click)="showComments(gif)">
            <ion-icon name="chatbubbles"></ion-icon> {{ gif.comments }}
          </ion-button>
        </ion-list-header>
      </div>
    </ion-list>
  `,
  styles: [
    `
      ion-list {
        padding: 0;
      }

      ion-label {
        margin: 0;
        padding: 10px 0;
        overflow: auto;
      }

      .gif ion-spinner {
        margin: auto;
        position: absolute;
        left: 0px;
        right: 0px;
        z-index: 1;
        background-color: var(--ion-color-dark);
        border: 10px solid var(--ion-color-dark);
        border-radius: 5px;
        padding: 20px;
      }

      .comments {
        display: block;
        width: 100%;
        margin-top: 5px;
        text-align: right;
        color: var(--ion-color-medium);
      }

      ion-list-header ion-button {
        margin: 0;
      }

      .preload-background {
        width: 100%;
        height: auto;
      }

      video {
        width: 100%;
        height: auto;
        margin: auto;
        background: transparent;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GifListComponent {
  @Input() gifs!: Gif[];
  @Output() gifLoadStart = new EventEmitter<string>();
  @Output() gifLoadComplete = new EventEmitter<string>();

  trackByFn(index: number, gif: Gif) {
    return gif.permalink;
  }

  playVideo(ev: Event, gif: Gif) {
    const video = ev.target as HTMLVideoElement;

    if (video.readyState === 4) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    } else {
      if (video.getAttribute('data-event-loadeddata') !== 'true') {
        this.gifLoadStart.emit(gif.permalink);
        video.load();

        const handleVideoLoaded = async () => {
          this.gifLoadComplete.emit(gif.permalink);
          await video.play();
          video.removeEventListener('loadeddata', handleVideoLoaded);
        };

        video.addEventListener('loadeddata', handleVideoLoaded);
        video.setAttribute('data-event-loadeddata', 'true');
      }
    }
  }

  showComments(gif: Gif) {
    Browser.open({
      toolbarColor: '#fff',
      url: `https://reddit.com/${gif.permalink}`,
      windowName: '_system',
    });
  }
}

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [GifListComponent],
  exports: [GifListComponent],
})
export class GifListComponentModule {}
