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
import { LitElement, html, } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import styles from './CoronaRadioStyles.js';

function randomID(length = 10) {
  return `_${Math.random().toString(36).substr(2, length)}`;
}

export class CoronaRadio extends LitElement {
  static get properties() {
    return {
      /**
       * Disabled state of radio
       */
      disabled: {
        type: Boolean
      },
      /**
       * ReadOnly state of radio
       */
      readonly: {
        type: Boolean
      },
      /**
       * Radio value related to forms
       */
      value: {
        type: String,
        reflect: true
      },
      /**
       * Checked status of radio
       */
      checked: {
        type: Boolean,
        reflect: true
      },
      /**
       * If true, selecting one radio from this radio group (radios with same name) will be required
       */
      required: {
        type: Boolean
      },
      /**
       * Name of radio related to forms
       */
      name: {
        type: String,
        reflect: true
      },
      /**
       * Associated form for radio
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
    this._formElementId = randomID();
    this.checked = false;
    this.disabled = false;
    this.readonly = false;

    this._onClick = this._onClick.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);

    this.addEventListener('click', this._onClick);
    this.addEventListener('keyup', this._onKeyUp);
    this.addEventListener('keydown', this._onKeyDown);
  }

  firstUpdated(changedProps) {
    super.firstUpdated && super.firstUpdated(changedProps);

    this._formElement = this.shadowRoot.querySelector(`#${this._formElementId}`);

    if (this._formElement) {
      this.appendChild(this._formElement);
    }

    this._setInitialAttribute('role', 'radio');

    if (this.hasAttribute('autofocus')) {
      this._updateTabIndex();
      this.focus();
    }
  }

  updated(changedProps) {
    if (changedProps.has('disabled') || changedProps.has('readonly')) {
      this.setAttribute('aria-disabled', this._disabled.toString());
    }

    if (changedProps.has('checked')) {
      this.setAttribute('aria-checked', this.checked.toString());

      if (this.checked) {
        this._uncheckGroup();
        this._dispatchEvent('change');
        this._dispatchEvent('input');
      }
    }

    if (changedProps.has('disabled') || changedProps.has('readonly') || changedProps.has('checked')) {
      this._updateTabIndex();
    }
  }

  get _disabled() {
    return this.disabled || (this.readonly && !this.checked);
  }

  static get styles() {
    return styles;
  }

  render() {
    return html`
      ${this._labelledInput}
      ${this._radio}
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
   * HTML structure to be used as radio visible dot
   * @return {TemplateResult} HTML of radio dot
   */
  get _inputTemplate() {
    return html`
      <slot name="input-template">
        <span class="radio">
          <span class="check"></span>
        </span>
      </slot>
    `;
  }

  /**
   * Text to be used as label for the radio
   * @return {TemplateResult} HTML of label
   */
  get _labelTemplate() {
    return html`
      <span class="label"><slot></slot></span>
    `;
  }

  /**
   * Native radio to be moved to light DOM for communication with native forms
   * @return {TemplateResult} HTML of native radio
   */
  get _radio() {
    return html`
      <span class="slot-control"><slot name="_radio"></slot></span>

      <input
        aria-hidden="true"
        @change="${this._onChange}"
        ?checked="${this.checked}"
        ?disabled="${this._disabled}"
        form="${ifDefined(this.form)}"
        id="${this._formElementId}"
        @input="${this._onInput}"
        name="${ifDefined(this.name)}"
        ?required="${this.required}"
        slot="_radio"
        tabindex="-1"
        type="radio"
        .value="${this.value}">
    `;
  }

  _queryParentRoot(elem, query) {
    const rootNode = elem.getRootNode() || document.documentElement;

    return Array.from(rootNode.querySelectorAll(query));
  }

  _queryGroup(active = false) {
    if (this.name) {
      return this._queryParentRoot(this, `${this.nodeName.toLowerCase()}[name=${this.name}]${active ? `:not([aria-disabled=true])` : ''}`);
    }

    return [];
  }

  _uncheckGroup() {
    const group = this._queryGroup();

    for (const radio of group) {
      if (radio !== this) {
        radio.checked = false;
        radio._updateTabIndex();
      }
    }
  }

  _updateTabIndex() {
    this.setAttribute('tabindex', (this.checked || !this._isGroupChecked()) && !this._disabled ? '0' : '-1');
  }

  _isGroupChecked() {
    return this._queryGroup().find(radio => radio.checked);
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

    this._onClick(e);
  }

  /**
   * Sets checked to true if radio is not disabled
   * @param  {event} e Original click event
   */
  _onClick(e) {
    if (this._disabled) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }

    this.checked = true;
  }

  /**
   * Checks radio on spacebar or Enter keyup if radio is currently being pressed
   * @param  {event} e Original keyup event
   */
  _onKeyUp(ev) {
    if (ev.key === 'Enter' || ev.key === ' ') {
      this.checked = true;

      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  _dispatchEvent(ev) {
    this.dispatchEvent(new CustomEvent(ev, {
      bubbles: true
    }));
  }

  /**
   * Inits rowing if arrows are pressed, and prevents Enter and spacebar default behavior on keydown
   * @param  {event} ev Original keydown event
   */
  _onKeyDown(ev) {
    if (ev.key === 'Enter' || ev.key === ' ') {

      ev.preventDefault();
      ev.stopPropagation();
    }

    const arrowKeys = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
    if (arrowKeys.includes(ev.key)) {
      this._row(ev);
    }
  }

  _row(ev) {
    const group = this._queryGroup(true);
    const currentIndex = group.indexOf(this);
    const newIndex = this._nextIndex(group, currentIndex, ev.key);

    if (newIndex !== null) {
      const newCheckedRadio = group[newIndex];

      newCheckedRadio.checked = true;
      newCheckedRadio.focus();

      ev.stopPropagation();
      ev.preventDefault();
    }
  }

  _nextIndex(group, currentIndex, key) {
    if (group.length === 0) {
      return null;
    }

    switch (key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        return currentIndex - 1 < 0 ? group.length - 1 : currentIndex - 1;
      case 'ArrowRight':
      case 'ArrowDown':
        return currentIndex + 1 > group.length - 1 ? 0 : currentIndex + 1;
      default:
        return null;
    }
  }
}
