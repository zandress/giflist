import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store'

interface HomeState {
  currentlyLoadingGifs: string[];
  loadedGifs: string[];
  settingsModalIsOpen: boolean;
}


@Injectable()
export class HomeStore extends ComponentStore<HomeState> {
  constructor() {
    super({
      currentlyLoadingGifs: [],
      loadedGifs: [],
      settingsModalIsOpen: false,
    });
  }
}
