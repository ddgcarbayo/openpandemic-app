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

import { LitElement, html, css, } from 'lit-element';
import '../elements/corona-card/corona-card.js';
import '../elements/corona-button/corona-button.js';
import { until, } from 'lit-html/directives/until.js';
import commonStyles from '../elements/styles/common.js';
import styles from '../elements/styles/recommendations.js';
import * as micros from '../elements/micros/micros.js';

export class RecommendationPage extends LitElement {
  static get styles() {
    return [
      commonStyles,
      styles,
    ];
  }

  get recommendationDataSource() {
    throw Error('Should override this getter: resultDataSource');
  }

  get resultsPage() {
    throw Error('Should override this getter: recommendationsPage');
  }

  _getDataById(data, id) {
    return data.filter((d) => d.id === id)[0];
  }

  renderRecommendations(recommendations) {
    return html`
      <corona-card class="column ${recommendations.classMark ? 'mark' : ''}" heading="${recommendations.heading}">
      <figure slot="image">${micros[recommendations.figure]}</figure>
      <ul>
        ${recommendations.content.map((recommendation) => html`<li>${recommendation}</li>`)}
      </ul>
    </corona-card>
      `;
  }

  _templateIntro(result) {
    return html`
      <div class="intro ${result.classMark ? 'mark' : ''}">
        <p class="antelead">${result.anteLead}</p>
        <h1 class="title">${result.heading}</h1>
      </div>
    `;
  }

  get templateRecommendations() {
    return html`
  ${until(
    fetch(this.recommendationDataSource)
      .then(res => res.json())
      .then(recommendations => {
        return html`
          ${this._templateIntro(this._getDataById(recommendations[2], 'intro'))}
         <h2 class="antelead" id="#recomendacionesown">${recommendations[3][0].own}</h2>
          <section class="row" id="#recomendacionesown">
            ${recommendations[0][1].map(r => this.renderRecommendations(r))}
          </section>
          <h2 class="antelead" id="#recomendacionesothers">${recommendations[3][0].other}</h2>
          <section class="row" id="#recomendacionesothers">
           ${recommendations[1][1].map(r => this.renderRecommendations(r))}
          </section>
          <p>
            <corona-button variant="light" @click="${this._goToResults}">${recommendations[3][0].action}</corona-button>
          </p>
        `;
      })
      .catch(err => html`<span>Error: ${err}</span>`)
    ,
    html`
      <span>...</span>
    `
  )}
`;
  }

  _goToResults() {
    //navigate to login
    window.dispatchEvent(
      new CustomEvent('vaadin-router-go',
        { detail: { pathname: this.location.params.to || this.resultsPage, }, }));
  }

  render() {
    return html`
    <div class="page light">
     ${this.templateRecommendations}
    </div>
    `;
  }
}
