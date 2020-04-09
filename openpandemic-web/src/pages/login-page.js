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
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import commonStyles from '../elements/styles/common.js';
import '../elements/corona-checkbox/corona-checkbox.js';
import '../elements/corona-input/corona-input.js';
import '../elements/corona-button/corona-button.js';
import '../elements/corona-spinner/corona-spinner.js';

class LoginPage extends LitElement {

  static get properties() {
    return {
      prefix: {
        type: String
      },
      phoneNumber: {
        type: String,
        attribute: 'phone-number'
      },
      legalChecked: {
        type: Boolean,
        attribute: 'legal-checked'
      },
      invalid: {
        type: Boolean
      },
      spinner: {
        type: Boolean,
        reflect: true
      },
      content: {
        type: Object
      },
      loading: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();
    this.phoneNumber = '';
    this.legalChecked = false;
    this.invalid = false;
    this.spinner = true;
    this._getContent();
  }

  installApp() {
    window.pwaInstallApp();
  }

  _getContent() {
    fetch('data/pages/login-page.json').then(res => res.json()).then(content => {
      this.content = content;
      if (!this.prefix) {
        this.prefix = content.prefixDefault;
      }
    });
  }

  updated(changedProps) {
    if (changedProps.has('invalid')) {
      this.loading = false;
    }
  }

  static get styles() {
    return [
      commonStyles,
      css`
        form {
          flex: auto;
          display: flex;
          flex-direction: column;
        }
        .mid {
          flex: none;
        }
        .bottom {
          flex: none;
          margin-top: auto;
        }
        .fieldset {
          margin: 0 0 1.5rem;
          display: flex;
        }
        .prefix {
          width: 4.6875rem;
          margin-right: 1.5rem;
          flex: none;
        }

        .check {
          margin-bottom: 1.25rem;
        }

        .check span,
        .check corona-button {
          font-weight: 700;
          font-size: 1rem;
          line-height: 1.5rem;
        }

        .check corona-button {
          text-decoration: none;
          margin: 0;
        }
        .error {
          margin: -.5rem 0 .5rem;
        }
      `
    ]
  }

  render() {
    const content = this.content;
    return html`
      <corona-spinner ?visible="${this.spinner}" id="spinner"></corona-spinner>
      ${content ? html`
        <div class="page">
          <div class="top">
            <p class="antelead">${content.antelead}</p>
            <h1 class="title">${content.title}</h1>
            <p>${content.intro}</p>
          </div>

          <form @submit="${this._onSubmit}">
            <div class="mid">
              <div class="fieldset">
                <corona-input class="prefix" label="${content.prefixLabel}" name="prefix" required value="${this.prefix}" @input="${e => this._updateProp('prefix', e.target.value)}" ?invalid="${this.invalid}" error-msg-id="errorMsg"></corona-input>
                <corona-input class="phone" type="tel" inputmode="tel" maxlength="12" required name="phone" label="${content.phoneLabel}" value="" @input="${e => this._updateProp('phoneNumber', e.target.value)}" ?invalid="${this.invalid}" error-msg-id="errorMsg"></corona-input>
              </div>
              ${this.invalid ? html`
                <p class="error" id="errorMsg">${content.error.invalidPhone}</p>
              ` : ''}
            </div>
            <div class="bottom">
              <corona-checkbox class="check" name="legal" ?checked="${this.legalChecked}" @change="${e => this.legalChecked = e.target.checked}">
                <span>${unsafeHTML(content.legalCheck)}</span>
              </corona-checkbox>

              <p class="legal">${content.legalFooter}</p>

              <corona-button ?loading="${this.loading}" class="submit" ?disabled="${!this._allAccepted}">${content.submitButton}</corona-button>
            </div>
          </form>
        </div>
      ` : ''}
   `;
  }

  get _allAccepted() {
    return this.legalChecked && this.prefix && this.phoneNumber;
  }

  _updateProp(prop, value) {
    this[prop] = value;
    this.invalid = false;
  }

  _onSubmit(e) {
    e.preventDefault();
    this.loading = true;
    this.invalid = false;
    this.dispatchEvent(new CustomEvent('login-request', {
      bubbles: true,
      composed: true,
      detail: {
        prefix: this.prefix,
        phoneNumber: this.phoneNumber,
        legal: this.legalChecked
      }
    }));
  }
}

customElements.define('login-page', LoginPage);
