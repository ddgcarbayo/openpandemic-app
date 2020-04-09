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
import '../elements/corona-input/corona-input.js';
import '../elements/corona-button/corona-button.js';

class ConfirmCodePage extends LitElement {

  static get properties() {
    return {
      phoneNumber: {
        type: String,
        attribute: 'phone-number'
      },
      codeLength: {
        type: Number,
        attribute: 'code-length'
      },
      newSmsDelay: {
        type: Number,
        attribute: 'new-sms-delay'
      },
      invalid: {
        type: Boolean
      },
      content: {
        type: Object
      },
      loading: {
        type: Boolean
      },
      _code: {
        type: Array,
        attribute: false
      },
      _timer: {
        type: Number,
        attribute: false
      }
    };
  }

  constructor() {
    super();
    this.phoneNumber = window.sessionStorage.getItem('phoneNumber');
    this.codeLength = 6;
    this.newSmsDelay = 300;
    this.invalid = false;
    this.loading = false;
    this._getContent();
  }

  _getContent() {
    fetch('data/pages/confirm-code-page.json').then(res => res.json()).then(content => {
      this.content = content;
    });
  }

  connectedCallback() {
    super.connectedCallback && super.connectedCallback();
    this.resetNewSmsTimer();
  }

  disconnectedCallback() {
    super.disconnectedCallback && super.disconnectedCallback();
    this.clearNewSmsTimer();
  }

  get codeLength() {
    return this._codeLength;
  }

  set codeLength(newVal) {
    const oldVal = this._codeLength;
    if (newVal !== oldVal) {
      this._codeLength = newVal;
      this._code = new Array(newVal).fill('');
      this.requestUpdate('codeLength', oldVal);
    }
  }

  get newSmsDelay() {
    return this._newSmsDelay;
  }

  set newSmsDelay(newVal) {
    const oldVal = this._newSmsDelay;
    if (newVal !== oldVal) {
      this._newSmsDelay = newVal;
      this._timer = newVal;
      this.requestUpdate('newSmsDelay', oldVal);
    }
  }

  get _timer() {
    return this.__timer;
  }

  set _timer(newVal) {
    const oldVal = this.__timer;
    if (oldVal !== newVal) {
      this.__timer = newVal;
      if (newVal <= 0) {
        this.clearNewSmsTimer();
      }
      this.requestUpdate('_timer', oldVal);
    }
  }

  get _fullCode() {
    return this._code.join('');
  }

  get _timerMinutes() {
    return Math.floor(this._timer / 60);
  }

  get _timerSeconds() {
    return this._timer % 60;
  }

  updated(changedProps) {
    if (changedProps.has('codeLength') || changedProps.has('invalid') || changedProps.has('content')) {
      this._inputs = this.shadowRoot.querySelectorAll('.digit');
      this.loading = false;
    }
  }

  static get styles() {
    return [
      commonStyles,
      css`
        .top {
          flex: none;
        }
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
        .title {
          border: 2px solid #DFE9F2;
          padding: .5em;
          border-radius: 8px;
          display: inline-block;
          letter-spacing: 1px;
        }

        .fieldset {
          margin: 0 0 1.5rem;
          display: flex;
        }

        .digit {
          width: 2.625rem;
          margin-right: .5rem;
          flex: none;
        }

        .digit input {
          padding: 1rem 0;
          text-align: center;
        }

        .error {
          margin: -.5rem 0 .5rem;
        }
      `
    ]
  }

  render() {
    const content = this.content;
    return content ? html `
      <div class="page">
        <div class="top">
          <p class="antelead">${content.antelead}</p>
          <h1 class="title">${this.phoneNumber}</h1>
          <p>${content.intro}</p>
        </div>

        <form @submit="${this._onSubmit}">
          <div class="mid">
            <div class="fieldset">
              ${this._code.map((item, index) => html`
                <corona-input class="digit" type="number" inputmode="tel" min="0" max="9" @keyup="${e => this._onDigitKeyup(e, index)}" @input="${e => this._onDigitInput(e, index)}" allowed-pattern="[0-9]" ?invalid="${this.invalid}"></corona-input>
              `)}
              <input type="hidden" name="code" value="${this._fullCode}">

            </div>

            ${this.invalid ? html`
              <p class="error">${content.error.invalidCode}</p>
            ` : ''}

            <p class="legal">
              ${this._timer > 0 ? html`
                ${content.newCodeDelayMsg} ${this._timerMinutes ? html`${this._timerMinutes}${content.minutes}` : ''} ${this._timerSeconds}${content.seconds}.
              ` : html`
                <corona-button link @click="${this._onNewSmsClick}">${content.newCodeButton}</corona-button>
              `}
            </p>
          </div>
          <div class="bottom">
            <corona-button ?loading="${this.loading}" class="submit" ?disabled="${this._fullCode.length !== this.codeLength}">${content.submitButton}</corona-button>
          </div>
        </form>
      </div>
   ` : '';
  }

  initNewSmsTimer() {
    this._interval = setInterval(() => {
      this._timer -= 1;
    }, 1000);
  }

  resetNewSmsTimer() {
    this._timer = this.newSmsDelay;
    this.initNewSmsTimer();
  }

  clearNewSmsTimer() {
    clearInterval(this._interval);
  }

  _onDigitKeyup(e, index) {
    if (e.code === 'Backspace' && index > 0) {
      this._inputs[index - 1].focus();
    }
  }

  _onDigitInput(e, index) {
    const lastDigit = e.data;
    e.target.value = lastDigit;
    this._code[index] = lastDigit;
    this.requestUpdate('_code');
    this.invalid = false;
    if (index < this.codeLength - 1 && lastDigit !== null) {
      this._inputs[index + 1].focus();
    }
  }

  _onNewSmsClick(e) {
    this.loading = false;
    this.dispatchEvent(new CustomEvent('new-sms-request', {
      bubbles: true,
      composed: true,
      detail: {
        phoneNumber: this.phoneNumber
      }
    }));
    this.resetNewSmsTimer();
  }

  _onSubmit(e) {
    e.preventDefault();
    this.loading = true;
    if (this._fullCode.length === this.codeLength) {
      this.dispatchEvent(new CustomEvent('sms-validation-request', {
        bubbles: true,
        composed: true,
        detail: {
          code: this._fullCode
        }
      }));
    }
  }
}

customElements.define('confirm-code-page', ConfirmCodePage);
