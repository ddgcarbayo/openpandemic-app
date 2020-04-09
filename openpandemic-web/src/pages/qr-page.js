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

import { LitElement, html, css } from 'lit-element';
import commonStyles from '../elements/styles/common.js';
import '../elements/corona-button/corona-button.js';
import 'webcomponent-qr-code';

class QrPage extends LitElement {

  static get properties() {
    return {
      content: {
        type: Object
      },
      qr: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this._getContent();
    this.qr = window.sessionStorage.getItem('qrCode');
    this.evaluationResult = window.sessionStorage.getItem('result');
    this.color = this._calculateColor();
  }

  _getContent() {
    fetch('data/pages/qr-page.json').then(res => res.json()).then(content => {
      this.content = content;
    });
  }

  _calculateColor() {
    let closeToPersonWithSymptoms = window.sessionStorage.getItem('closeToPersonWithSymptoms') === 'true';
    let isCurated = window.localStorage.getItem('isCured') === 'true';
    let color = 'doubt-color';
    if (isCurated) {
      color = 'ok-color';
    } else {
      if (closeToPersonWithSymptoms || this.evaluationResult === 'symptoms') {
        color = 'notok-color';
      }
    }
    return color;
  }

  updated(changedProps) {
    console.log(changedProps, this.qr);
    if ((changedProps.has('qr') || changedProps.has('content')) && this.content && this.qr) {
      this._svg = this.shadowRoot.querySelector('qr-code');
      this._updateSvgStyle();
    }
  }

  _updateSvgStyle() {
    console.log('update styles', this._svg);
    const style = document.createElement('style');
    style.innerHTML = `
      svg { height: 100%; width: 100%; }
      .bg { fill: var(--qr-bg-color, #fff); }
      .fg { fill: var(--qr-${this.color}, #000); }
    `;
    this._svg.shadowRoot.appendChild(style);
  }

  static get styles() {
    return [
      commonStyles,
      css`
        :host {
          background-color: var(--main-color, #014582);
          --qr-generic-color: var(--main-color, #014582);
          --qr-ok-color: var(--secondary-color, #25CDCE);
          --qr-doubt-color: #FFBC00;
          --qr-notok-color: var(--highlight-color, #F35A5D);
          --qr-color: var(--qr-generic-color);
        }
        .top {
          flex: none;
        }
        .bottom {
          margin-top: auto;
        }
        .wrap {
          max-width: 320px;
          width: 100%;
          margin: 0 auto;
        }
        .qr-box {
          margin-bottom: 2rem;
          width: 100%;
          background-color: var(--light-color, #fff);
          height: 0;
          padding-bottom: 100%;
          border-radius: 16px;
        }
        qr-code {
          display: block;
          padding: 2.5rem 2.5rem 3rem;
        }
      `
    ]
  }

  render() {
    const content = this.content;
    return content ? html`
      <div class="page light">
        <div class="top">
          <p class="antelead">${content.antelead}</p>
          <h1 class="title">${content.title}</h1>
          <div class="wrap">
            <div class="qr-box">
              <qr-code data="${this.qr}" format="svg" margin="0"></qr-code>
            </div>
          </div>

          <p>${content.intro}</p>
        </div>
        <div class="bottom">
          <corona-button variant="light" @click="${this._goBack}">${content.backButton}</corona-button>
        </div>
      </div>
   ` : '';
  }

  _goBack() {
    window.dispatchEvent(
      new CustomEvent('vaadin-router-go',
        { detail: { pathname: this.location.params.to || `/autoevaluation-result-${this.evaluationResult}` } }));
  }
}

customElements.define('qr-page', QrPage);
