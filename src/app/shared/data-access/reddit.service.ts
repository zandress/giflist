import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, map, of } from 'rxjs';
import { RedditPost, RedditResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class RedditService {
  constructor(private http: HttpClient) {}

  getGifs() {
    return this.http
      .get<RedditResponse>(
        `https://www.reddit.com/r/${subreddit}/hot/.json?limit=100`
      )
      .pipe(
        // If there is an error, just return an empty observable
        // This prevents the stream from breaking
        catchError(() => EMPTY),

        // Convert response into the gif format we need
        map((res) => this.convertRedditPostsToGifs(res.data.children))
      );
  }

  private convertRedditPostsToGifs(posts: RedditPost[]){
    // TODO: Implement
  }

  private getBestSrcForGif(post: RedditPost) {
    // TODO: Implement
  }
}
