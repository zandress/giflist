import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { PopoverController } from "@ionic/angular";
import { SettingsService } from "../shared/data-access/settings.service";

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { Settings } from "../shared/interfaces";

@Component({
    selector: 'app-settings',
    template: `
        <ion-header>
            <ion-toolbar color="light">
                <ion-buttons slot="end">
                    <ion-button (click)="popoverCtrl.dismiss()">
                        <ion-icon slot="icon-only" name="close"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding"> </ion-content>
    `,
    styles: [
        `
            :host {
                height: 100%;
            }

            ion-segment {
                --ion-background-color: #fff;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
    settingsForm = this.fb.nonNullable.group<Settings>({
        sort: 'hot',
        perPage: 10,
    });

    constructor(
        private fb: FormBuilder,
        public settingsService: SettingsService,
        public popoverCtrl: PopoverController
    ) {}

    handleSave() {
        this.settingsService.save(this.settingsForm.getRawValue());
        this.popoverCtrl.dismiss();
    }
}

@NgModule({
    imports: [CommonModule, ReactiveFormsModule, IonicModule],
    declarations: [SettingsComponent],
    exports: [SettingsComponent],
})
export class SettingsComponentModule {}