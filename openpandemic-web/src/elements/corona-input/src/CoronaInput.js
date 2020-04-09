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

import { LitElement, html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import styles from './CoronaInputStyles.js';

function randomID(length = 10) {
  return `_${Math.random().toString(36).substr(2, length)}`;
}

export class CoronaInput extends LitElement {
  static get properties() {
    return {
      /**
       * Type for the input
       */
      type: {
        type: String,
        reflect: true,
      },
      /**
       * Disabled state of input
       */
      disabled: {
        type: Boolean,
        reflect: true,
      },
      /**
       * Input value
       */
      value: {
        type: String,
      },
      /**
       * Name of input related to forms
       */
      name: {
        type: String,
      },
      /**
       * If true, input is required
       */
      required: {
        type: Boolean,
      },
      /**
       * If true, input is readonly
       */
      readonly: {
        type: Boolean,
      },
      /**
       * If true, autocomplete on input will be set to 'on'; otherwise, to 'off'
       */
      autocomplete: {
        type: Boolean,
      },
      /**
       * Label for the input
       */
      label: {
        type: String,
      },
      /**
       * Placeholder for the input
       */
      placeholder: {
        type: String
      },

      pattern: {
        type: String,
      },

      errorMsgId: {
        type: String,
        attribute: 'error-msg-id'
      },

      allowedPattern: {
        type: String,
        attribute: 'allowed-pattern',
      },

      invalid: {
        type: Boolean,
        reflect: true
      },
      /**
       * Max attribute for input
       */
      max: {
        type: String,
      },
      /**
       * maxlength attribute for input
       */
      maxlength: {
        type: Number,
      },
      /**
       * Min attribute for input
       */
      min: {
        type: String,
      },
      /**
       * minlength attribute for input
       */
      minlength: {
        type: Number,
      },
      /**
       * step attribute for input
       */
      step: {
        type: Number,
      },
      /**
       * Text which the input will get through an aria-describedby attribute
       */
      accessibleDescription: {
        type: String,
        attribute: 'accessible-description',
      },
      /**
       * Set to true to auto-validate the input value as you type.
       */
      autoValidate: {
        type: Boolean,
        attribute: 'auto-validate',
      },

      inputmode: {
        type: String
      },
      /**
       * Associated form for input
       */
      form: {
        type: String,
      },
      _formElementId: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.type = 'text';
    this.label = '';
    this.invalid = false;
    this.autoValidate = false;
    this._previousValidInput = '';
    this._patternAlreadyChecked = false;
    this._formElementId = randomID();
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this._rootNode = this.getRootNode ? this.getRootNode() : document;
    this._formElement = this.shadowRoot.querySelector(`#${this._formElementId}`);
    this._moveToLight(this._formElement);
    this._a11yDescription = this.shadowRoot.querySelector(`#description${this._formElementId}`);
    this._moveToLight(this._a11yDescription);
    this._field = this.shadowRoot.querySelector('.field');
    const _inputStyle = document.createElement('style');
    _inputStyle.style.display = 'none';
    _inputStyle.innerHTML = this._inputInnerStyles;
    this.appendChild(_inputStyle);
    if (this.hasAttribute('autofocus')) {
      this.focus();
    }
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('value')) {
      if (this.invalid && this.required && this.value) {
        this.invalid = false;
      }
      if (this.autoValidate) {
        this.validate();
      }
    }
  }

  static get styles() {
    return styles;
  }

  get _inputInnerStyles() {
    return `
      input#${this._formElementId}::-webkit-inner-spin-button,
      input#${this._formElementId}::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input#${this._formElementId}::-webkit-clear-button,
      input#${this._formElementId}::-webkit-search-decoration,
      input#${this._formElementId}::-webkit-search-cancel-button,
      input#${this._formElementId}::-webkit-search-results-button,
      input#${this._formElementId}::-webkit-search-results-decoration {
        appearance: none;
        display: none;
      }
    `;
  }

  render() {
    return html`
      ${this.labelledInput}
    `;
  }

  /**
   * HTML block containing visible label, input slot and input
   * @return {TemplateResult} HTML with label, input slot and input
   */
  get labelledInput() {
    return html`
      <div class="field" @focusin="${this._onFocusin}" @focusout="${this._onFocusout}">
        ${this.labelBlock} ${this._input}
      </div>
    `;
  }

  /**
   * HTML block containing label span
   * @return {TemplateResult} HTML with label
   */
  get labelBlock() {
    return html`
      ${this.inputLabel ? html`
        <span class="label" aria-hidden="true" @click="${this.focus}">${this.inputLabel}</span>
      ` : ''}
    `;
  }

  /**
   * Returns text to be used as input aria-label
   * @return {String} aria-label text for input
   */
  get inputLabel() {
    return this.label;
  }

  /**
   * Native input to be moved to light DOM for communication with native forms and ARIA relationships
   * @return {TemplateResult} HTML of native input
   */
  get _input() {
    return html`
      <span class="slot-input">
        <slot name="_input"></slot>
      </span>

      <input
        aria-describedby="description${this._formElementId}"
        aria-errormessage="${ifDefined(this.errorMsgId)}"
        aria-label="${this.inputLabel}"
        aria-invalid="${String(this.invalid)}"
        autocomplete="${this.autocomplete ? 'on' : 'off'}"
        ?disabled="${this.disabled}"
        form="${ifDefined(this.form)}"
        id="${this._formElementId}"
        placeholder="${ifDefined(this.placeholder)}"
        inputmode="${ifDefined(this.inputmode)}"
        @input="${this._onInputInput}"
        @keypress="${this._onInputKeypress}"
        @invalid="${this._onInputInvalid}"
        max="${ifDefined(this.max)}"
        maxlength="${ifDefined(this.maxlength)}"
        min="${ifDefined(this.min)}"
        minlength="${ifDefined(this.minlength)}"
        name="${ifDefined(this.name)}"
        pattern="${ifDefined(this.pattern)}"
        ?readonly="${this.readonly}"
        ?required="${this.required}"
        slot="_input"
        step="${ifDefined(this.step)}"
        type="${this.type}"
        .value="${ifDefined(this.value)}"
      />

      <span style="display: none;" slot="_input" id="description${this._formElementId}"
        >${this.accessibleDescription}</span
      >
    `;
  }

  _onFocusin() {
    setTimeout(() => {
      this._focus();
    }, 1);
  }

  _focus() {
    this.setAttribute('focused', '');
    this.dispatchEvent(new CustomEvent('focus'));
  }

  _onFocusout() {
    setTimeout(() => {
      const active = this._rootNode.activeElement;
      const shadowActive = this.shadowRoot.activeElement || active;
      if (!this._field.contains(shadowActive) && active !== this._formElement) {
        this._blur();
      }
    }, 1);
  }

  _blur() {
    this.removeAttribute('focused');
    this.dispatchEvent(new CustomEvent('blur'));
  }

  /**
   * Method for passing focus to native input
   */
  focus() {
    this._formElement.focus();
  }

  /**
   * Method for passing blur to native input
   */
  blur() {
    this._formElement.blur();
  }

  /**
   * Method for passing select to native input
   */
  select() {
    this._formElement.select();
  }

  /**
   * Method for passing setSelectionRange to native input
   */
  setSelectionRange(...args) {
    this._formElement.setSelectionRange(...args);
  }

  /**
   * Method for passing setRangeText to native input
   */
  setRangeText(...args) {
    this._formElement.setRangeText(...args);
  }

  _moveToLight(element) {
    if (element) {
      this.appendChild(element);
    }
  }

  _onInputInput(ev) {
    this.value = ev.target.value;

    if (this.allowedPattern && !this._patternAlreadyChecked) {
      const valid = this._checkPattern();

      if (!valid) {
        this.value = this._previousValidInput;
      }
    }

    this._previousValidInput = this.value;
    this._patternAlreadyChecked = false;
  }

  _onInputKeypress(ev) {
    if (!this.allowedPattern && this.type !== 'number') {
      return;
    }

    const regexp = this._patternReg;
    if (!regexp) {
      return;
    }

    if (ev.metaKey || ev.ctrlKey || ev.altKey) {
      return;
    }

    this._patternAlreadyChecked = true;

    const thisChar = String.fromCharCode(ev.charCode);
    if (this._validChar(ev) && !regexp.test(thisChar)) {
      ev.preventDefault();
    }
  }

  _onInputInvalid(ev) {
    this.invalid = true;
  }

  _checkPattern() {
    const regexp = this._patternReg;
    if (!regexp) {
      return true;
    }
    for (let i = 0; i < this.value.length; i += 1) {
      if (!regexp.test(this.value[i])) {
        return false;
      }
    }
    return true;
  }

  get _patternReg() {
    let pattern;
    if (this.allowedPattern) {
      pattern = new RegExp(this.allowedPattern);
    } else if (this.type === 'number') {
      pattern = /[0-9.,e-]/;
    }
    return pattern;
  }

  _validChar(ev) {
    const keyCode = ev.keyCode;
    const nonV = keyCode === 8 || keyCode === 9 || keyCode === 13 || keyCode === 27;
    const mNonV = keyCode === 19 || keyCode === 20 || keyCode === 45 || keyCode === 46 || keyCode === 144 || keyCode === 145 || (keyCode > 32 && keyCode < 41) || (keyCode > 111 && keyCode < 124);
    return !nonV && !(ev.charCode === 0 && mNonV);
  }

  validate() {
    let valid = this._formElement.checkValidity();
    if (valid && this.required && this.value === '') {
      valid = false;
    }
    this.invalid = !valid;
    this.dispatchEvent(new CustomEvent('corona-input-validate'));
    return valid;
  }
}
