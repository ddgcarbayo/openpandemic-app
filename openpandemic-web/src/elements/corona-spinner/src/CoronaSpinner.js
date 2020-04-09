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
import styles from './CoronaSpinnerStyles.js';

export class CoronaSpinner extends LitElement {
  static get properties() {
    return {
      visible: {
        type: Boolean,
        reflect: true
      }
    }
  }
  constructor() {
    super();

  }
  static get styles() {
    return styles;
  }
  render() {
    return html`
      <div class="spinner">
        ${spinner}
      </div>
    `;
  }
}
