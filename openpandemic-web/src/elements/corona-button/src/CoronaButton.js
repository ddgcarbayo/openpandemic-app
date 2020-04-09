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
import { spinner } from '../../micros/micros.js';
import styles from './CoronaButtonStyles.js';

function randomID(length = 10) {
  return `_${Math.random().toString(36).substr(2, length)}`;
}

export class CoronaButton extends LitElement {

  static get properties() {
    return {
      /**
       * URL of linked resource. If defined, element will behave as a link. If not, it will behave as a button.
       */
      href: {
        type: String,
        reflect: true
      },

      /**
       * Type for the button, related to forms. Available types are 'button', 'submit' and 'reset'
       */
      type: {
        type: String
      },

      /**
       * Disabled state of action
       */
      disabled: {
        type: Boolean
      },

      /**
       * Button value related to forms
       */
      value: {
        type: String
      },

      /**
       * Name of button related to forms
       */
      name: {
        type: String
      },

      /**
       * Loading state of button for showing spinner
       */
      loading: {
        type: Boolean,
        reflect: true
      },

      /**
       * Associated form for button
       */
      form: {
        type: String
      },

      /**
       * Associated formaction for button
       */
      formaction: {
        type: String
      },

      /**
       * Associated formenctype for button
       */
      formenctype: {
        type: String
      },

      /**
       * Associated formmethod for button
       */
      formmethod: {
        type: String
      },

      /**
       * Associated formnovalidate for button
       */
      formnovalidate: {
        type: Boolean
      },

      /**
       * Associated formtarget for button
       */
      formtarget: {
        type: String
      },

      /**
       * If defined, indicates to the browser that the linked resource in `href` is intended to be downloaded rather than displayed. Value specifies default file name.
       */
      download: {
        type: String
      },

      /**
       * Language of linked `href` resource
       */
      hreflang: {
        type: String
      },

      /**
       * Relationship of the URL linked with `href`, as space-separated link types.
       * https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types
       */
      rel: {
        type: String
      },

      /**
       * Name of the browsing context to display the `href`. For example, '_self', '_blank'...
       */
      target: {
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
    this.type = 'submit';
    this._active = false;
    this._formElementId = randomID();

    this._onClick = this.onClick.bind(this);
    this._onKeyUp = this.onKeyUp.bind(this);
    this._onKeyDown = this.onKeyDown.bind(this);
    this.addEventListener('click', this._onClick);
    this.addEventListener('keyup', this._onKeyUp);
    this.addEventListener('keydown', this._onKeyDown);

    this.addEventListener('blur', () => {
      this.active = false
    });
  }

  disconnectedCallback() {
    /* istanbul ignore else */
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.active = false;
  }

  firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this._formElementContainer = this.shadowRoot.getElementById(this._formElementId);
    if (this._formElementContainer) {
      this.appendChild(this._formElementContainer);
      this._updateFormElement();
    }
    this._setInitialAttribute('role', this.href ? 'link' : 'button');
    if (!this.disabled) {
      this._setInitialAttribute('tabindex', '0');
      this.setAttribute('aria-disabled', 'false');
    }
    if (this.hasAttribute('autofocus') && !this.href) {
      this.focus();
    }
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('href')) {
      this.setAttribute('role', this.href ? 'link' : 'button');
      if (this._formElementContainer) {
        this._updateFormElement();
      }
    }
    if (changedProps.has('disabled')) {
      if (this.disabled) {
        this._disableAction();
      } else {
        this._enableAction();
      }
    }
  }

  /**
   * Active state of action
   * @return {Boolean} Active state of action
   */
  get active() {
    return this._active;
  }

  /**
   * Sets active state for action
   * @param  {Boolean} value Active state for action
   */
  set active(value) {
    if (value !== this._active) {
      this._active = value;
      if (value) {
        this.setAttribute('active', '');
      } else {
        this.removeAttribute('active');
      }
    }
  }

  static get styles() {
    return styles;
  }

  render() {
    return html`
      ${this.loading && !this.href ? html`
        <span class="spinner">
          ${spinner}
        </span>
      ` : html`
        <span>
          <slot></slot>
        </span>
      `}
      ${this._action}
    `;
  }

  /**
   * Native element container to be moved to light DOM for communication with native forms
   * @return {TemplateResult} HTML of native element container
   */
  get _action() {
    return html`
      <span class="action-slot">
        <slot name="_action"></slot>
      </span>
      <span id="${this._formElementId}" slot="_action">
        ${this.href ? this._link : this._button }
      </span>
    `;
  }

  /**
   * Native element for actions with href
   * @return {TemplateResult} HTML of `a` tag with property bindings
   */
  get _link() {
    return html`
      <a
        style="opacity: 0; position: absolute; top: 0; left: 0; right: 0; bottom: 0;"
        aria-hidden="true"
        tabindex="-1"
        href="${ifDefined(!this.disabled ? this.href : undefined)}"
        hreflang="${ifDefined(this.hreflang)}"
        target="${ifDefined(this.target)}"
        download="${ifDefined(this.download)}"
        rel="${ifDefined(this.rel)}"
        @click="${this._onNativeLinkClick}"
      >
      </a>
    `;
  }

  /**
   * Native element for actions without href
   * @return {TemplateResult} HTML of `button` tag with property bindings
   */
  get _button() {
    return html`
      <button
        style="display: none;"
        aria-hidden="true"
        tabindex="-1"
        type="${this.type}"
        ?disabled="${this.disabled}"
        name="${ifDefined(this.name)}"
        value="${ifDefined(this.value)}"
        form="${ifDefined(this.form)}"
        formaction="${ifDefined(this.formaction)}"
        formenctype="${ifDefined(this.formenctype)}"
        formmethod="${ifDefined(this.formmethod)}"
        ?formNoValidate="${this.formnovalidate}"
        formtarget="${ifDefined(this.formtarget)}">
      </button>
    `;
  }

  _updateFormElement() {
    this._formElement = this._formElementContainer.querySelector('a, button');
  }

  _setInitialAttribute(attr, value) {
    if (!this.hasAttribute(attr)) {
      this.setAttribute(attr, value);
    }
  }

  _disableAction() {
    this.setAttribute('aria-disabled', 'true');
    this.setAttribute('tabindex', '-1');
  }

  _enableAction() {
    this.setAttribute('aria-disabled', 'false');
    this.setAttribute('tabindex', '0');
  }

  _onNativeLinkClick() {
    this.focus();
  }

  _isValidKey(key) {
    return this.href ? key === 'Enter' : key === 'Enter' || key === ' ';
  }

  /**
   * Fires click on native action element (for forms or href navigation) if action is not disabled
   * @param  {event} e Original click event
   */
  onClick(e) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return;
    }
    if (!e.defaultPrevented && this._formElement && e.target !== this._formElement) {
      this._formElement.dispatchEvent(new MouseEvent('click', {
        relatedTarget: this,
        composed: true
      }));
    }
  }

  /**
   * Fires click on element on spacebar (if not href available) or Enter keyup if action is currently being pressed
   * @param  {event} e Original keyup event
   */
  onKeyUp(e) {
    if (this._isValidKey(e.key) && this.active) {
      this.active = false;
      this.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        composed: true,
        cancelable: true,
      }));
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /**
   * Sets active state on element on spacebar (if not href available) or Enter keydown
   * @param  {event} e Original keydown event
   */
  onKeyDown(e) {
    if (this._isValidKey(e.key) && !this.loading) {
      this.active = true;
      e.preventDefault();
      e.stopPropagation();
    }
  }
}
