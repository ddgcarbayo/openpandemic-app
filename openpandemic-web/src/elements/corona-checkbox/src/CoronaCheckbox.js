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

/* eslint-disable class-methods-use-this */
import { LitElement, html } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import styles from './CoronaCheckboxStyles.js';

function randomID(length = 10) {
  return `_${Math.random().toString(36).substr(2, length)}`;
}

export class CoronaCheckbox extends LitElement {
  static get properties() {
    return {
      /**
       * Disabled state of checkbox
       */
      disabled: {
        type: Boolean
      },
      /**
       * Checkbox value related to forms
       */
      value: {
        type: String
      },
      /**
       * Checked status of checkbox
       */
      checked: {
        type: Boolean
      },
      /**
       * If true, checkbox is in indeterminate state
       */
      indeterminate: {
        type: Boolean
      },
      /**
       * If true, checking checkbox will be required
       */
      required: {
        type: Boolean
      },
      invalid: {
        type: Boolean,
        reflect: true
      },
      /**
       * Name of checkbox related to forms
       */
      name: {
        type: String
      },
      /**
       * Associated form for checkbox
       */
      form: {
        type: String
      },

      _formElementId: {
        type: String,
        attribute: false
      }
    };
  }

  constructor() {
    super();
    this.checked = false;
    this._formElementId = randomID();

    this._onClick = this.onClick.bind(this);
    this.addEventListener('click', this._onClick);

    this._onKeyUp = this.onKeyUp.bind(this);
    this._onKeyDown = this.onKeyDown.bind(this);
    this.addEventListener('keyup', this._onKeyUp);
    this.addEventListener('keydown', this._onKeyDown);
  }

  firstUpdated(changedProps) {
    super.firstUpdated && super.firstUpdated(changedProps);

    this._setInitialAttribute('role', 'checkbox');

    if (!this.disabled) {
      this._setInitialAttribute('tabindex', '0');
      this._setInitialAttribute('aria-disabled', 'false');
    }

    this._formElement = this.shadowRoot.querySelector(`#${this._formElementId}`);

    if (this._formElement) {
      this.appendChild(this._formElement);
    }

    if (this.hasAttribute('autofocus')) {
      this.focus();
    }
  }

  updated(changedProps) {
    super.updated && super.updated(changedProps);

    if (changedProps.has('checked') || changedProps.has('indeterminate')) {
      this.invalid = false;
      if (this.indeterminate) {
        this.setAttribute('aria-checked', 'mixed');
      } else {
        this.setAttribute('aria-checked', this.checked.toString());
      }
    }

    if (changedProps.has('disabled')) {
      this.setAttribute('aria-disabled', this.disabled.toString());
      this.setAttribute('tabindex', this.disabled ? '-1' : '0');
    }
    if (changedProps.has('invalid')) {
      if (this.invalid) {
        this.setAttribute('aria-invalid', 'true');
      } else {
        this.removeAttribute('aria-invalid');
      }
    }
  }

  /**
   * Checked state of checkbox
   * @return {Boolean} Checked state of checkbox
   */
  get checked() {
    return this._checked;
  }

  /**
   * Sets checked state for checkbox
   * @param  {Boolean} value Checked state for checkbox
   */
  set checked(newValue) {
    const oldValue = this.checked;

    if (newValue !== oldValue) {
      this._checked = newValue;

      if (newValue && this.indeterminate) {
        this.indeterminate = false;
      }

      this.requestUpdate('checked', oldValue);
    }
  }

  /**
   * Indeterminate state of checkbox
   * @return {Boolean} Indeterminate state of checkbox
   */
  get indeterminate() {
    return this._indeterminate;
  }

  /**
   * Sets indeterminate state for checkbox
   * @param  {Boolean} value Indeterminate state for checkbox
   */
  set indeterminate(newValue) {
    const oldValue = this.indeterminate;

    if (newValue !== oldValue) {
      this._indeterminate = newValue;

      if (newValue) {
        this.checked = false;
      }

      this.requestUpdate('indeterminate', oldValue);
    }
  }

  static get styles() {
    return [
      styles
    ]
  }

  render() {
    return html`
      ${this._labelledInput}
      ${this._checkbox}
    `;
  }

  /**
   * HTML structure combining dot (inputTemplate) and label (labelTemplate)
   * @return {TemplateResult} HTML of visible dot and label
   */
  get _labelledInput() {
    return html`
      <div class="container">
        ${this._inputTemplate}
        ${this._labelTemplate}
      </div>
    `;
  }

  /**
   * HTML structure to be used as checkbox visible dot
   * @return {TemplateResult} HTML of checkbox dot
   */
  get _inputTemplate() {
    return html`
      <slot name="input-template">
        <span class="box">
          <span class="check"></span>
        </span>
      </slot>
    `;
  }

  /**
   * Text to be used as label for the checkbox
   * @return {TemplateResult} HTML of label
   */
  get _labelTemplate() {
    return html`
      <span class="label">
        <slot></slot>
      </span>
    `;
  }

  /**
   * Native checkbox to be moved to light DOM for communication with native forms
   * @return {TemplateResult} HTML of native checkbox
   */
  get _checkbox() {
    return html`
      <span class="slot-control">
        <slot name="_checkbox"></slot>
      </span>

      <input
        aria-hidden="true"
        ?checked="${this.checked}"
        ?disabled="${this.disabled}"
        form="${ifDefined(this.form)}"
        id="${this._formElementId}"
        .indeterminate="${this.indeterminate}"
        name="${ifDefined(this.name)}"
        ?required="${this.required}"
        slot="_checkbox"
        tabindex="-1"
        type="checkbox"
        .value="${this.value}"
        @change="${this._onChange}"
        @input="${this._onInput}">
    `;
  }

  _setInitialAttribute(attr, value) {
    if (!this.hasAttribute(attr)) {
      this.setAttribute(attr, value);
    }
  }

  _onInput(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  _onChange(e) {
    e.preventDefault();
    e.stopPropagation();
    this.onClick(e);
  }

  _toggle() {
    this.checked = !this.checked;
    this._dispatchEvent('change');
    this._dispatchEvent('input');
  }

  /**
   * Sets checked to true if checkbox is not disabled
   * @param  {event} e Original click event
   */
  onClick(e) {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }

    this._toggle();
  }

  /**
   * Checks checkbox on spacebar or Enter keyup if checkbox is currently being pressed
   * @param  {event} e Original keyup event
   */
  onKeyUp(e) {
    if ((e.key === 'Enter' || e.key === ' ')) {
      this._toggle();
      e.preventDefault();
      e.stopPropagation();
    }
  }

  _dispatchEvent(event) {
    this.dispatchEvent(new CustomEvent(event, {
      bubbles: true
    }));
  }

  /**
   * Prevents Enter and Spacebar default
   * @param  {event} e Original keydown event
   */
  onKeyDown(e) {
    const { key } = e;

    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}
