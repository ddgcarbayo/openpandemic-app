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
import styles from './CoronaSelectStyles.js';

function randomID(length = 10) {
  return `_${Math.random().toString(36).substr(2, length)}`;
}

export class CoronaSelect extends LitElement {
  static get properties() {
    return {
      /**
       * Array of options to show, with 'text' and 'value'
       */
      items: {
        type: Array,
      },

      /**
       * Label for select
       */
      label: {
        type: String,
      },

      /**
       * Current value of select. Must match the value from one of the options
       */
      _value: {
        type: String,
      },

      /**
       * If true, select is currently disabled
       */
      disabled: {
        type: Boolean,
      },

      /**
       * If true, select is required
       */
      required: {
        type: Boolean,
      },

      /**
       * If true, select is readonly
       */
      readonly: {
        type: Boolean,
        reflect: true,
      },

      /**
       * If true, select is currently invalid
       */
      invalid: {
        type: Boolean,
        reflect: true
      },

      /**
       * Name for select when relating to form elements
       */
      name: {
        type: String,
      },

      /**
       * ID of form element the select is related with
       */
      form: {
        type: String,
      },

      /**
       * Index of selected option
       */
      selectedIndex: {
        type: Number,
        attribute: 'selected-index',
      },

      placeholder: {
        type: String
      },

      _formElementId: {
        type: String,
        attribute: false,
      }
    };
  }

  constructor() {
    super();
    this.invalid = false;
    this.items = [];
    this._value = '';
    this.selectedIndex = -1;
    this.name = '';
    this.readonly = false;
    this.required = false;
    this._formElementId = randomID();
  }

  /**
   * Total options length
   * @return {Number} Total options length
   */
  get length() {
    return this.items.length;
  }

  /**
   * Type of select element
   * @return {String} Return 'select-one'
   */
  get type() {
    return this._formElement.type;
  }

  /**
   * Returns currently selected option in select
   * @return {Object} Currently selected option in select
   */
  get selectedOption() {
    return this._formElement.selectedOption;
  }

  get value() {
    return this._formElement ? this._formElement.value : this._value;
  }

  set value(newVal) {
    const oldVal = this._value;
    if (newVal !== oldVal) {
      this._value = newVal;
      this.requestUpdate('value', oldVal);
    }
  }

  firstUpdated(changedProps) {
    super.firstUpdated && super.firstUpdated(changedProps);
    this.__initialAttributeDelegation();
    this._rootNode = this.getRootNode ? this.getRootNode() : document;
    this._field = this.shadowRoot.querySelector('.field');
    this._formElement = this.shadowRoot.querySelector(`#${this._formElementId}`);
    if (this._formElement) {
      this.appendChild(this._formElement);
    }
    if (this.hasAttribute('autofocus')) {
      this.focus();
    }
  }

  get delegatedAttributes() {
    return [
      'aria-activedescendant',
      'aria-autocomplete',
      'aria-controls',
      'aria-describedby',
      'aria-flowto',
      'aria-haspopup',
      'aria-labelledby',
      'aria-owns',
      'inputmode',
    ];
  }

  /**
   * Target node of attribute delegation
   */
  get delegatedAttributesTarget() {
    return this._formElement;
  }

  /**
   * Overrides element own setAttribute method to perform attribute delegation
   * @param {String} name  Attribute name
   * @param {String} value Attribute value
   */
  setAttribute(name, value) {
    const attributeNames = this.delegatedAttributes;

    if (this.delegatedAttributesTarget && attributeNames.indexOf(name) > -1) {
      this.delegatedAttributesTarget.setAttribute(name, value);
      super.removeAttribute(name);
    } else {
      super.setAttribute(name, value);
    }
  }

  /**
   * Overrides element own removeAttribute method to perform attribute delegation
   * @param {String} name  Attribute name
   */
  removeAttribute(name) {
    const attributeNames = this.delegatedAttributes;

    if (this.delegatedAttributesTarget && attributeNames.indexOf(name) > -1) {
      this.delegatedAttributesTarget.removeAttribute(name);
    }

    super.removeAttribute(name);
  }

  __initialAttributeDelegation() {
    if (this.delegatedAttributesTarget) {
      this.delegatedAttributes.forEach(attributeName => {
        const attributeValue = this.getAttribute(attributeName);

        if (typeof attributeValue === 'string') {
          this.delegatedAttributesTarget.setAttribute(attributeName, attributeValue);
          super.removeAttribute(attributeName);
        }
      });
    }
  }

  static get styles() {
    return styles;
  }

  render() {
    return html`
      ${this.labelledSelect}
    `;
  }

  /**
   * HTML block containing visible label, select slot and select
   * @return {TemplateResult} HTML with label, select slot and select
   */
  get labelledSelect() {
    return html`
      <div class="field" @focusin="${this._onFocusin}" @focusout="${this._onFocusout}">
        ${this.labelBlock} ${this._select}
      </div>
    `;
  }

  /**
   * HTML block containing label span
   * @return {TemplateResult} HTML with label
   */
  get labelBlock() {
    return html`
      ${this.selectLabel ? html`
        <span class="label" aria-hidden="true" @click="${this.focus}">${this.selectLabel}</span>
      ` : ''}
    `;
  }

  /**
   * Returns text to be used as select aria-label
   * @return {String} aria-label text for select
   */
  get selectLabel() {
    return this.label;
  }

  /**
   * Native select to be moved to light DOM for communication with native forms and ARIA relationships
   * @return {TemplateResult} HTML of native select
   */
  get _select() {
    return html`
      <span class="slot-select">
        <slot name="_select"></slot>
      </span>

      <select
        slot="_select"
        id="${this._formElementId}"
        aria-label="${this.selectLabel}"
        aria-describedby="description${this._formElementId}"
        aria-invalid="${ifDefined(this.invalid || undefined)}"
        name="${ifDefined(this.name)}"
        form="${ifDefined(this.form)}"
        ?disabled="${this.disabled}"
        ?required="${this.required}"
        .value="${this.value}"
        .selectedIndex="${this.selectedIndex}"
        @focus="${this.focus}"
        @invalid="${this._onInvalid}"
      >
        ${this.placeholder ? html`
          <option disabled selected hidden value>${this.placeholder}</option>
        ` : ''}
        ${this.items.map(item => html`
          <option value="${item.value}">${item.text}</option>
        `)}
      </select>
      <span style="display: none;" slot="_select" id="description${this._formElementId}"
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
   * Returns option with specified index
   */
  item(index) {
    return this._formElement.item(index);
  }

  /**
   * Returns option matching provided name or value
   */
  namedItem(value) {
    return this._formElement.namedItem(index);
  }

  _onInvalid() {
    this.invalid = true;
    /**
     * Fired when element gets invalid state
     * @event invalid
     */
    this.dispatchEvent(new CustomEvent('invalid'));
  }

  _fireEvents() {
    this.invalid = false;
    /**
     * Fired when user updates selected option
     * @event change
     */
    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
      }),
    );
  }
}
