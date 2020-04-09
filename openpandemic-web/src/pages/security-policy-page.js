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
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import '../elements/corona-button/corona-button.js';
import commonStyles from '../elements/styles/common.js';

class SecurityPolicyPage extends LitElement {
  static get properties() {
    return {
      content: {
        type: Object
      }
    }
  }

  constructor() {
    super();
    this._getContent();
  }

  _getContent() {
    fetch('data/pages/security-policy-page.json').then(res => res.json()).then(content => {
      this.content = content;
    });
  }

  static get styles() {
    return commonStyles;
  }

  render() {
    const content = this.content;
    return content ? html`
      <div class="page">
        <div class="intro">
          <h1 class="title">${content.title}</h1>
        </div>
        <section>
          ${unsafeHTML(content.text)}
        </section>
        <p>
          <corona-button @click="${this._goToLogin}">${content.backButton}</corona-button>
        </p>
      </div>
    ` : '';
  }

  _goToLogin() {
    //init flow
    this.dispatchEvent(new CustomEvent('start-flow', {
      bubbles: true,
      composed: true
    }));

    //navigate to login
    window.dispatchEvent(
      new CustomEvent('vaadin-router-go',
        { detail: { pathname: this.location.params.to || '/login' } }));
  }
}

customElements.define('security-policy-page', SecurityPolicyPage);
