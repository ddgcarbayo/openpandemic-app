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

import {
  LitElement,
  html,
  css,
} from 'lit-element';
import commonStyles from '../elements/styles/common.js';
import '../elements/corona-radio/corona-radio.js';
import '../elements/corona-card/corona-card.js';
import '../elements/corona-button/corona-button.js';

class SymptomCheckListPage extends LitElement {
  constructor() {
    super();
    this.questions = [];
    this.threshold = 30;
    this.questionAnswer = {};
    this.intro = {};
    this._loadQuestions();
  }

  _loadQuestions() {
    return fetch('data/pages/symptom-checklist-page.json')
      .then(res => res.json())
      .then(data => {
        this.questions = data.questions;
        this.threshold = data.threshold;
        this.questionAnswer = data.questionAnswer;
        this.intro = data.intro;
        this._loadAnswersFromSession();
      });
  }

  static get properties() {
    return {
      isAllChecked: { type: Boolean, },
    };
  }

  static get styles() {
    return [
      commonStyles,
      css`
        strong {
          display: block;
          font-weight: 700;
          font-size: 1rem;
          line-height: 1.5rem;
          margin-bottom: .625rem;
        }

        li::before {
          content:none;
        }

        corona-radio {
          margin-bottom: .5rem;
        }
      `,
    ];
  }

  _renderQuestion(questionObject) {
    return html `
      <li>
        <strong>${questionObject.title.es}</strong>
        <corona-radio
          name=${questionObject.id}
          ?checked=${this.answers[questionObject.id] === true}
          value="si"
          @change=${() => this._recordAnswer(`${questionObject.id}`, true)}
        >${this.questionAnswer.yes}</corona-radio>
        <corona-radio name=${questionObject.id}
          ?checked=${this.answers[questionObject.id] === false}
          value="no"
          @change=${() => this._recordAnswer(`${questionObject.id}`, false)}
          >${this.questionAnswer.no}</corona-radio>
      </li>
    `;
  }

  _recordAnswer(questionId, answer) {
    this.answers[questionId] = answer;
    this.isAllChecked = Object.keys(this.answers).length === this.questions.length;
  }

  _loadAnswersFromSession() {
    const data = window.sessionStorage.getItem('answers') || '{}';
    this.answers = JSON.parse(data);
    this.isAllChecked = Object.keys(this.answers).length === this.questions.length;
  }

  _checkCuredQuestion() {
    const question = this.questions.find(item => item.isCured);
    let score = 0;
    if (question) {
      if (this.answers[question.id]) {
        window.localStorage.setItem('isCured', true);
        score = question.score;
      } else {
        window.localStorage.removeItem('isCured');
      }
    }
    return score;
  }

  _checkProximityQuestion() {
    let score = 0;
    let closeToPersonWithSymptoms = window.sessionStorage.getItem('closeToPersonWithSymptoms') === 'true';
    closeToPersonWithSymptoms = true;
    if (closeToPersonWithSymptoms) {
      const question = this.questions.find(item => item.questionInferredByProximity);
      if (!this.answers[question.id]) {
        score = question.score;
      }
    }
    return score;
  }

  _evaluateSymptons() {
    let sc = 0;
    let question;

    for (let k in this.answers) {
      if (this.answers[k]) {
        question = this.questions.find(item => item.id === k);
        sc = sc + question.score;
      }
    }

    sc = sc + this._checkCuredQuestion();
    sc = sc + this._checkProximityQuestion();
    if (sc >= this.threshold) {
      return 'symptoms';
    } else {
      return 'no-symptoms';
    }
  }

  render() {
    return html`
      ${this.questions.length ? html`
        <div class="page">
          <p class="antelead">${this.intro.anteLead}</p>
          <h1 class="title">${this.intro.heading}</h1>
          <p>${this.intro.body}</p>
          <ol>
            ${this.questions.map(q => this._renderQuestion(q))}
          </ol>
          <corona-button @click="${this._onClick}" ?disabled=${!this.isAllChecked}>${this.intro.action}</corona-button>
        </div>
      ` : html`
        <span>...</span>
      `}
   `;
  }

  _onClick() {
    const result = this._evaluateSymptons();
    const event = new CustomEvent('vaadin-router-go', {
      detail: {
        pathname: `/autoevaluation-result-${result}`,
      },
    });
    const lastEvaluationTime = (new Date()).getTime();
    window.sessionStorage.setItem('answers', JSON.stringify(this.answers));
    window.sessionStorage.setItem('result', result);
    window.sessionStorage.setItem('lastEvaluationTime', lastEvaluationTime);
    this.dispatchEvent(new CustomEvent('test-result', {
      bubbles: true,
      composed: true,
      detail: {
        data: {
          test: this.answers,
          result: result,
        },
      },
    }));
    window.dispatchEvent(event);
  }
}

customElements.define('symptom-checklist-page', SymptomCheckListPage);
