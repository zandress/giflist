import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-settings-form',
  template: `
    <form [formGroup]="settingsForm" (ngSubmit)="save.emit(true)">
      <ion-segment color="primary" formControlName="sort">
        <ion-segment-button value="hot"> Hot </ion-segment-button>
        <ion-segment-button value="new"> New </ion-segment-button>
      </ion-segment>

      <ion-segment color="primary" formControlName="perPage">
        <ion-segment-button value="10"> 10 </ion-segment-button>
        <ion-segment-button value="20"> 20 </ion-segment-button>
        <ion-segment-button value="30"> 30 </ion-segment-button>
      </ion-segment>

      <ion-button type="submit" expand="full"> Save </ion-button>
    </form>
  `,
  styles: [
    `
      form > * {
        margin-bottom: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsFormComponent {
  @Input() settingsForm!: FormGroup;
  @Output() save = new EventEmitter<boolean>();
}

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
  declarations: [SettingsFormComponent],
  exports: [SettingsFormComponent],
})
export class SettingsFormComponentModule {}
