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

class BluetoothPermissionPage extends LitElement {
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
    this._bluetoothPermissionKey = 'bluetoothPermissionUser';
    this._hasBluetoothPermission = null;
    this.loading = false;
    this._checkBluetoothPermission();
    this._getContent();
  }

  _getContent() {
    fetch('data/pages/bluetooth-permission-page.json').then(res => res.json()).then(content => {
      this.content = content;
    });
  }

  static get styles() {
    return [
      commonStyles,
      css`
      :host{
        --size: 3rem;
      }

      .bottom {
        flex: none;
        margin-top: auto;
      }

      li {
        position: relative;
        padding: 0 0 0 calc(var(--size) + 1em);
        margin: 0 0 var(--size);
      }

      li::before {
        display: none;
      }

      .antelead,
      li + li {
        margin-bottom: 0;
      }

      figure {
        width: var(--size);
        height: var(--size);
        position: absolute;
        top: 0;
        left: 0;
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
        <ul>
          ${content.items.map(contentItem => html`
            <li>
              <figure>${micros[contentItem.figure]}</figure>
              <h2 class="antelead">${contentItem.title}</h2>
              <p>${contentItem.text}</p>
            </li>
          `)}
        </ul>
    </section>
        <div class="bottom">
          <corona-button ?loading="${this.loading}" @click="${this._onGetBluetoothPermission}">${content.confirmButton}</corona-button>
          <corona-button variant="contrast" @click="${this._onCancelBluetoothPermission}">${content.cancelButton}</corona-button>
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

  _checkBluetoothPermission() {
    this._hasBluetoothPermission = window.localStorage.getItem(this._bluetoothPermissionKey);
    if (this._hasBluetoothPermission !== null && this._hasBluetoothPermission !== 'false' && this._hasBluetoothPermission === 'true') {
      this._goToNextPage();
    }
  }

  _onGetBluetoothPermission() {
    this.loading = true;
    navigator.geolocation && navigator.geolocation.getCurrentPosition((() => {
      this._setBluetooth(true);
    }
    ), ((e) => {
      console.warn(e);
      this.loading = false;
      this._setBluetooth(false);
    }
    ), { enableHighAccuracy: this.locationHighAccuracy, timeout: 5000, maximumAge: 0 });
  }

  _onCancelBluetoothPermission(event) {
    event.preventDefault();
    this.loading = false;
    this._setBluetooth(false);
    this._goToNextPage();
  }

  _setBluetooth(q) {
    window.localStorage.setItem(this._bluetoothPermissionKey, q);
    this._goToNextPage();
  }
}

customElements.define('bluetooth-permission-page', BluetoothPermissionPage);
