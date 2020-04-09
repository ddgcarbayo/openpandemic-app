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

export class CoronaHeading extends LitElement {

  static get properties() {
    return {
      /**
       * Allows to define an aria-level for the main header text.
       * If 0 is provided, the header text won't be treated as a heading.
       */
      level: {
        type: Number
      }
    };
  }

  constructor() {
    super();
    this.level = 2;
  }

  updated(changedProps) {
    if (changedProps.has('level')) {
      this._levelChanged(this.level);
      this.dispatchEvent(new CustomEvent('level-changed', {
        detail: {
          value: this.level
        }
      }));
    }
  }

  static get styles() {
    return [
      css`
        :host { display: block; }
        :host([hidden]) { display: none; }
      `
    ];
  }

  render() {
    return html`
      <slot></slot>
    `;
  }

  _levelChanged(level) {
    if (level >= 1 && level <= 6) {
      this.setAttribute('aria-level', level);
      this.setAttribute('role', 'heading');
    } else {
      this.removeAttribute('aria-level');
      this.removeAttribute('role');
    }
  }
}