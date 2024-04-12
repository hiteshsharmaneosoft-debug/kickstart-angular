import { Component, OnInit } from '@angular/core';
import { newTracker, BrowserTracker } from '@snowplow/browser-tracker';
import { WebVitalsPlugin } from '@snowplow/browser-plugin-web-vitals';
import { TimezonePlugin } from '@snowplow/browser-plugin-timezone';
import { GeolocationPlugin, enableGeolocationContext } from '@snowplow/browser-plugin-geolocation';
import { enableButtonClickTracking, ButtonClickTrackingPlugin } from '@snowplow/browser-plugin-button-click-tracking';
import { LinkClickTrackingPlugin, enableLinkClickTracking } from '@snowplow/browser-plugin-link-click-tracking';
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
      appId: 'kickstart-ng',
      plugins: [
        WebVitalsPlugin(),
        LinkClickTrackingPlugin(),
        ButtonClickTrackingPlugin(),
        TimezonePlugin(),
        GeolocationPlugin()
      ]
    })
  }

  ngOnInit() {
    this.tracker.enableActivityTracking({
      minimumVisitLength: 15,
      heartbeatDelay: 5
    })
    enableLinkClickTracking({ pseudoClicks: true });
    enableButtonClickTracking();
    enableGeolocationContext();
    this.tracker.trackPageView({
      title: 'kickstart.home'
    });
  }


}
