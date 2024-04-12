import { Component, OnInit } from '@angular/core';
import { newTracker, BrowserTracker } from '@snowplow/browser-tracker';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'kickstart-angular';

  tracker: BrowserTracker;

  constructor() {
    this.tracker = newTracker('sp', environment.snowplowCollectorURL, {
      appId: 'kickstart-ng'
    })
  }

  ngOnInit() {
    this.tracker.trackPageView();
  }


}
