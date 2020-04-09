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
import '../elements/corona-button/corona-button.js';
import commonStyles from '../elements/styles/common.js';
import styles from '../elements/styles/autoevaluation-result.js';

const TWELVE_HOURS_IN_MINUTES = 720;
const MILLISECONDS_IN_ONE_MINUTE = 60 * 1000;

export class AutoevaluationResultPage extends LitElement {
  static get properties() {
    return {
      _timer: {
        type: Number,
        attribute: false,
      },
      timeLeftToNewAutoevaluation: {
        type: Number,
      },
      recommendations: { type: Array, },
    };
  }

  static get styles() {
    return [commonStyles,styles,];
  }

  constructor() {
    super();
    const lastEvaluationTime = window.sessionStorage.getItem('lastEvaluationTime');
    const waitTimeForNextAutoevaluation = parseInt(window.sessionStorage.getItem('waitTimeForNextAutoevaluation') || TWELVE_HOURS_IN_MINUTES) * MILLISECONDS_IN_ONE_MINUTE;

    this.nextEvaluationTime = parseInt(lastEvaluationTime) + waitTimeForNextAutoevaluation;
    this.closeToPersonWithSymptoms = window.sessionStorage.getItem('closeToPersonWithSymptoms') === 'true';
    this.recommendations = [];
    this.initTimer();
    this.loadData();
  }

  get resultDataSource() {
    throw Error('Should override this getter: resultDataSource');
  }

  get recommendationsPage() {
    throw Error('Should override this getter: recommendationsPage');
  }

  get resultSection() {
    throw Error('Should override this getter: resultSection');
  }

  disconnectedCallback() {
    super.disconnectedCallback && super.disconnectedCallback();
    this.clearTimer();
  }

  loadData() {
    fetch(this.resultDataSource)
      .then(res => res.json())
      .then(recommendations => this.recommendations = recommendations);
  }

  initTimer() {
    this.timeLeftToNewAutoevaluation = this.nextEvaluationTime - new Date();
    if (this.nextEvaluationTime - new Date() > 0) {
      this._interval = setInterval(() => {
        this.timeLeftToNewAutoevaluation = this.nextEvaluationTime - new Date();
        if (this.timeLeftToNewAutoevaluation <= 0) {
          this.timeLeftToNewAutoevaluation = 0;
          this.clearTimer();
        }
      }, 1000);
    }
  }

  clearTimer() {
    clearInterval(this._interval);
  }

  get _timerHours() {
    return Math.floor(this.timeLeftToNewAutoevaluation / (1000 * 60 * 60));
  }

  get _timerMinutes() {
    return Math.floor(this.timeLeftToNewAutoevaluation / (1000 * 60)) % 60;
  }

  get _timerSeconds() {
    return Math.floor(this.timeLeftToNewAutoevaluation / 1000) % 60;
  }

  get waitFormNewAutoevaluation() {
    return this.timeLeftToNewAutoevaluation > 0;
  }

  _getDataById(data, id) {
    return data.filter((d) => d.id === id)[0];
  }

  _goToNextPage() {
    window.dispatchEvent(
      new CustomEvent('vaadin-router-go',
        { detail: { pathname: this.recommendationsPage, },}));
  }

  _goToQr() {
    window.dispatchEvent(
      new CustomEvent('vaadin-router-go',
        { detail: { pathname: '/qr', }, }));
  }

  _goToAutevaluationPage() {
    window.sessionStorage.removeItem('answers');
    window.dispatchEvent(
      new CustomEvent('vaadin-router-go',
        { detail: { pathname: '/symptom-checklist', }, }));
  }

  get templateRecommendations() {
    return html`
        ${this.recommendations.length ?
    html`
            ${this._templateIntro(this._getDataById(this.recommendations, 'intro'))}
            ${this._templateResultWithSymptoms(this._getDataById(this.recommendations, this.resultSection))}
            ${this._templateQr(this._getDataById(this.recommendations, 'qr'))}
            ${this._templateRedo(this._getDataById(this.recommendations, 'redo'))}
          `
    :
    html`<span>...</span>`}
      `;
  }

  _templateIntro(result) {
    return html`
      <section class="intro">
        <p class="antelead">${result.anteLead}</p>
        <h1 class="title">${result.heading}</h1>
        <p>${result.body}</p>
      </section>
    `;
  }

  _templateResultDisclaimer(result) {
    return this.closeToPersonWithSymptoms ? html`
            <p class="disclaimer">${result.disclaimer}</p>
            <p>
          ` :
          html``;
  }

  _templateResultWithSymptoms(result) {
    return html`
    <section class="box">
    <h2 class="title">${result.anteLead}</h2>
       <p>${result.body}</p>
       <hr/>
       ${this._templateResultDisclaimer(result)}
        <corona-button @click="${this._goToNextPage}" variant="light">${result.action}</corona-button>
      </p>
    </section>
    `;
  }

  _templateQr(result) {
    return html`
    <section class="box secondary">
      <p class="antelead">${result.anteLead}</p>
      <h2 class="title">${result.heading}</h2>
      <p>${result.body}</p>
      <p>
        <corona-button @click="${this._goToQr}" variant="light">${result.action}</corona-button>
      </p>
    </section>
    `;
  }

  _templateRedo(result) {
    return html`
      <section class="next ${this.waitFormNewAutoevaluation ? 'line' : ''}">
        ${this.waitFormNewAutoevaluation ? html`<p><strong>${result.body} <time>${this._timerHours}h ${this._timerMinutes}m ${this._timerSeconds}s</time></strong></p>` : ''}
        <corona-button ?disabled=${this.waitFormNewAutoevaluation} @click=${this._goToAutevaluationPage}>${result.action}</corona-button>
      </section>
    `;
  }

  render() {
    return html`
      <div class="page">
        ${this.templateRecommendations}
      </div>
    `;
  }
}
