import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RedditService {
  getGifs() {
    return of([
      {
        src: '',
        author: '',
        name: '',
        permaLink: '',
        title: '',
        thumbnail: '',
        comments: 0,
      },
    ]);
  }
}
