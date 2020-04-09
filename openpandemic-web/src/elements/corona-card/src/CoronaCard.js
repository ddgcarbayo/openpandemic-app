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
import '../../corona-heading/corona-heading.js';
import styles from './CoronaCardStyles.js';

export class CoronaCard extends LitElement {

  static get properties() {
    return {
      /**
       * Heading content.
       */
      heading: {
        type: String,
      },

      /**
       * Allows to define an aria-level for the main header text.
       * If 0 is provided, the header text won't be treated as a heading.
       */
      headingLevel: {
        type: Number,
        attribute: 'heading-level',
      },

      /**
       * Provide image URL
       * If no image is provided the image is not shown.
       */
      image: {
        type: String,
      },

      /**
       * Provide image alternative text
       */
      altImage: {
        type: String,
        attribute: 'alt-image',
      },
    };
  }

  static get styles() {
  return [
      styles
    ]
  }

  render() {
    return html`

      ${this.image
        ? html`
            <img class="image" src="${this.image}" alt="${ifDefined(this.altImage)}" />
          `
        : html`
        <slot name="image"></slot>
        `}
      <corona-heading .level="${ifDefined(this.headingLevel)}" class="heading"
        >${this.heading}</corona-heading
      >
      <div class="content">
        <span class="slot">
          <slot></slot>
        </span>
      </div>
    `;
  }
}
