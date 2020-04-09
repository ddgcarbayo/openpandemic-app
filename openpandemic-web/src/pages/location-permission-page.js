/* eslint-disable no-unused-expressions */
/*
*
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

import { LitElement, html, css, } from 'lit-element';
import commonStyles from '../elements/styles/common.js';
import '../elements/corona-button/corona-button.js';
import * as micros from '../elements/micros/micros.js';

class LocationPermissionPage extends LitElement {
  static get properties() {
    return {
      content: {
        type: Object,
      },
      loading: {
        type: Boolean,
      },
    };
  }
  constructor() {
    super();
    this._locationPermissionKey = 'locationPermissionUser';
    this._hasLocationPermission = null;
    this.loading = false;
    this._checkLocationPermission();
    this._getContent();
  }

  _getContent() {
    fetch('data/pages/location-permission-page.json').then(res => res.json()).then(content => {
      this.content = content;
    });
  }

  static get styles() {
    return [
      commonStyles,
      css`

        .bottom {
          flex: none;
          margin-top: auto;
        }
        figure {
          width: 88px;
          height: 88px;
          margin: 1.5rem 0;
        }
      `,
    ];
  }

  render() {
    const content = this.content;
    return content ? html`
     <div class="page">
     <section>
        <h1 class="title">${content.title}</h1>
        <figure>${micros.location}</figure>
        <p class="antelead">${content.antelead}</p>
        <p>${content.intro}</p>
      </section>
      <div class="bottom">
        <corona-button ?loading="${this.loading}" @click="${this._onGetLocationPermission}">${content.confirmButton}</corona-button>
        <corona-button variant="contrast" @click="${this._onCancelLocationPermission}">${content.cancelButton}</corona-button>
      </div>
    </div>
    ` : '';
  }

  _goToNextPage() {
    let page = '/personal-data';
    if (window.localStorage.getItem('previouslyLogged')) {
      let result = window.sessionStorage.getItem('result');
      if (result) {
        page = `/autoevaluation-result-${result}`;
      }
    }

    window.dispatchEvent(
      new CustomEvent('vaadin-router-go',
        { detail: { pathname: page, }, }));
  }

  _checkLocationPermission() {
    this._hasLocationPermission = window.localStorage.getItem(this._locationPermissionKey);
    if (this._hasLocationPermission !== null && this._hasLocationPermission !== 'false' && this._hasLocationPermission === 'true') {
      this._goToNextPage();
    }
  }

  _onGetLocationPermission() {
    this.loading = true;
    navigator.geolocation && navigator.geolocation.getCurrentPosition((() => {
      this._setLocation(true);
    }
    ), ((e) => {
      console.warn(e);
      this.loading = false;
      this._setLocation(false);
    }
    ), { enableHighAccuracy: this.locationHighAccuracy, timeout: 5000, maximumAge: 0 });
  }

  _onCancelLocationPermission(event) {
    event.preventDefault();
    this.loading = false;
    this._setLocation(false);
    this._goToNextPage();
  }

  _setLocation(q) {
    window.localStorage.setItem(this._locationPermissionKey, q);
    this._goToNextPage();
  }
}

customElements.define('location-permission-page', LocationPermissionPage);
