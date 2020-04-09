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
import { until, } from 'lit-html/directives/until.js';
import '../elements/corona-button/corona-button.js';
import * as micros from '../elements/micros/micros.js';

class HomePage extends LitElement {
  static get styles() {
    return [
      commonStyles,
      css`
        :host {
          background-color: var(--main-color);
        }
        .app-header {
          position: sticky;
          top: 0px;
          color:var(--main-color);
          background-color: var(--light-color);
          z-index: 1;
          display: flex;
          align-items: center;
          padding: 0.5em 0;
          margin-bottom:1.5rem;
        }
        .app-header img {
          display:inline-block;
          margin: 0 1rem;
        }
        .app-header p {
          margin:0;
          font-size:1.125rem;
        }
        .loading {
            visibility: hidden;
        }
        .title {
          margin-bottom: 3rem;
        }
        .bottom {
          margin-top: auto;
        }
        corona-button {
          margin-top: 1rem;
        }
      `,
    ];
  }

  static get properties() {
    return {
      _classLoading: {
        type: String,
      },
    };
  }

  set loaded(value) {
    const oldValue = this.loaded;
    this._classLoading = value ? '' : 'loading';
    this.requestUpdate('loaded', oldValue);
  }

  constructor() {
    super();
    try {
      this.loaded = JSON.parse(window.sessionStorage.getItem('loaded'));
    } catch (e) {
      this.loaded = false;
    }
  }

  render() {
    return html`
      <div class="page light">
        <div class="app-header">
          <img src="/assets/logo-40x40.png">
          <p>Corona App</p>
        </div>
        ${this.getHomeContent}
      </div>
   `;
  }

  get getHomeContent() {
    if (!this.loaded) {
      return html`
        ${this.templatePolicy}
      `;
    } else {
      return html`
        <p>Loading...</p>
      `;
    }
  }

  get templatePolicy() {
    return html`
      ${until(
        fetch('data/pages/home-page.json')
          .then(res => res.json())
          .then(content => {
            return html`
              <div class="top">
                <h1 class="title">${content.title}</h1>
                <ul class="figure">
                  ${content.options.map((option) => html`
                    <li>
                      <figure>${micros[option.image]}</figure>
                      <p>${option.text}</p>
                    </li>
                  `)}
                </ul>
              </div>
              <div class="bottom">
                <p class="disclaimer">${content.legal}</p>
                ${this._templateActions(content.actions)}
              </div>
            `;
          })
          .catch(err => html`<span>Error: ${err}</span>`)
        ,
        html`
          <span>...</span>
        `
      )}
    `;
  }

  _templateActions(actions) {
    return html`
      <corona-button variant="light" @click="${this._goToLogin}">${actions[0].text}</corona-button>
    `;
  }


  _goToLogin() {
    //init flow
    this.dispatchEvent(new CustomEvent('start-flow', {
      bubbles: true,
      composed: true
    }));

    //navigate to login
    window.dispatchEvent(
      new CustomEvent('vaadin-router-go',
        { detail: { pathname: this.location.params.to || '/login', }, }));
  }

  _installApp() {
    window.pwaInstallApp();
  }
}

customElements.define('home-page', HomePage);
