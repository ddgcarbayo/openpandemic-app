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
import commonStyles from '../elements/styles/common.js';
import '../elements/corona-radio/corona-radio.js';
import '../elements/corona-input/corona-input.js';
import '../elements/corona-button/corona-button.js';
import '../elements/corona-select/corona-select.js';

class PersonalDataPage extends LitElement {

  static get properties() {
    return {
      data: {
        type: Object
      },
      invalidData: {
        type: Object
      },
      invalid: {
        type: Boolean
      },
      regionList: {
        type: Array
      },
      personalDataKeys: {
        type: Array
      },
      clinicalDataKeys: {
        type: Array
      },
      enablePersonalData: {
        type: Boolean
      },
      content: {
        type: Object
      },
      loading: {
        type: Boolean
      }
    };
  }

  constructor() {
    super();
    this.regionList = [];
    this.personalDataKeys = [];
    this.clinicalDataKeys = [];
    this.loading = false;
    this._loadUserDataFromSession();
    this.resetInvalidData();
    this._loadDataKeys();
    this._getContent();
    try {
      this.enablePersonalData = JSON.parse(window.sessionStorage.getItem('enablePersonalData'));
    } catch(e){
      this.enablePersonalData = false;
    }
  }

  updated(changedProps) {
    if (changedProps.has('invalid')) {
      this.loading = false;
    }
  }

  static get styles() {
    return [
      commonStyles,
      css`
        .legal {
          color: #0074a3;
          margin-bottom: 2rem;
          text-decoration: none;
          line-height: 1rem;
          display: block;
        }

        .field {
          margin-top: 1rem;
        }

        .birth ~ .birth {
          margin-left: 1rem;
        }

        .label {
          margin: 0 0 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.5rem;
          color: var(--main-color, #014582);
          cursor: default;
        }

        .fieldset {
          margin: 0;
          display: flex;
        }

        corona-radio + corona-radio {
          margin-top: .5rem;
        }

        .error {
          margin: .625rem 0 0 .625rem;
        }

        .notice {
          margin-top: 1rem;
          border-radius: .75rem;
          background-color: #e3e9f0;
          padding: 1.5rem 1rem 1rem;
          color: #000;
        }
      `
    ];
  }

  render() {
    const content = this.content;
    return content ? html`
      <div class="page">
        <div class="top">
          <p class="antelead">${content.antelead}</p>
          <h1 class="title">${content.title}</h1>
          <p>${content.intro}</p>
        </div>

        <form @submit="${this._onSubmit}">
          ${this.enablePersonalData ? html`
            <div class="field">
              <corona-input label="${content.name.label}" maxlength="100" placeholder="${content.name.placeholder}" autocomplete="off" name="name" required .value="${this.data.name}" @input="${e => this._updateData('name', e.target.value)}" ?invalid="${this.invalidData.name.length}"></corona-input>
              ${this._errorTemplate('name')}
            </div>
          ` : ''}
          <div class="field">
            <p class="label field">${content.birth.label}</p>
            <div class="fieldset">
              <corona-input class="birth" aria-label="${content.birth.day.label}" placeholder="${content.birth.day.placeholder}" name="birthDay" required autocomplete="off" .value="${this.data.birthDay}" @input="${e => this._updateData('birthDay', e.target.value, 'birth')}" allowed-pattern="[0-9]" ?invalid="${this.invalidData.birth.length}"></corona-input>
              <corona-input class="birth" aria-label="${content.birth.month.label}" placeholder="${content.birth.month.placeholder}" name="birthMonth" required autocomplete="off" .value="${this.data.birthMonth}" @input="${e => this._updateData('birthMonth', e.target.value, 'birth')}" allowed-pattern="[0-9]" ?invalid="${this.invalidData.birth.length}"></corona-input>
              <corona-input class="birth" aria-label="${content.birth.year.label}" placeholder="${content.birth.year.placeholder}" name="birthYear" required autocomplete="off" .value="${this.data.birthYear}" @input="${e => this._updateData('birthYear', e.target.value, 'birth')}" allowed-pattern="[0-9]" ?invalid="${this.invalidData.birth.length}"></corona-input>
            </div>
            ${this._errorTemplate('birth')}
          </div>
          ${this.enablePersonalData ? html`
            <div class="field">
              <corona-input label="${content.idNumber.label}" maxlength="9" placeholder="${content.idNumber.placeholder}" autocomplete="off" name="idNumber" required .value="${this.data.idNumber}" @input="${e => this._updateData('idNumber', e.target.value)}" ?invalid="${this.invalidData.idNumber.length}"></corona-input>
              ${this._errorTemplate('idNumber')}
            </div>
          ` : ''}
          <div class="field">
            <p class="label">${content.gender.label}</p>
            <div class="radioset" role="radiogroup" @change="${e => this._updateData('gender', e.target.value)}">
              <corona-radio name="gender" value="woman" required ?checked=${this.data.gender==='woman'}>${content.gender.woman}</corona-radio>
              <corona-radio name="gender" value="man" required ?checked=${this.data.gender==='man'}>${content.gender.man}</corona-radio>
            </div>
            ${this._errorTemplate('gender')}
          </div>
          ${this.enablePersonalData ? html`
            <div class="field">
              <corona-input label="${content.address.label}" maxlength="200" placeholder="${content.address.placeholder}" autocomplete="off" name="address" required .value="${this.data.address}" @input="${e => this._updateData('address', e.target.value)}" ?invalid="${this.invalidData.address.length}"></corona-input>
              ${this._errorTemplate('address')}
            </div>
          ` : ''}
          ${this.enablePersonalData ? html`
            <div class="field">
              <corona-input label="${content.postalCode.label}" placeholder="${content.postalCode.placeholder}" autocomplete="off" name="postalCode" required .value="${this.data.postalCode}" @input="${e => this._updateData('postalCode', e.target.value)}" allowed-pattern="[0-9]" ?invalid="${this.invalidData.postalCode.length}"></corona-input>
              ${this._errorTemplate('postalCode')}
            </div>
          ` : ''}
          ${this.enablePersonalData ? html`
            <div class="field">
              <corona-select name="region" label="${content.region.label}" placeholder="${content.region.placeholder}"
              .items="${this.regionList}"
              .value="${this.data.region}"
              @change="${e => this._updateData('region', e.target.value)}"
              ?invalid="${this.invalidData.region.length}"></corona-select>
              ${this._errorTemplate('region')}
            </div>
          ` : ''}
          <corona-button class="submit" ?disabled="${!this._allFilled}">${content.submitButton}</corona-button>
        </form>

      </div>
   ` : '';
  }

  _errorTemplate(item) {
    return this.invalidData[item].length > 0 ? html`
      <p class="error" id="${item}Error">
        ${this.invalidData[item].map(msg => html`
          <span class="error-msg">${msg}</span>
        `)}
      </p>
    ` : '';
  }

  get _allFilled() {
    return !Object.keys(this.data).find(key => !this.data[key]);
  }

  _updateData(key, value, invalidKey = key) {
    this.data[key] = value;
    this.invalidData[invalidKey] = [];
    this.requestUpdate('data');
    this.requestUpdate('invalidData');
  }

  _saveUserData() {
    window.sessionStorage.setItem('userData', JSON.stringify(this.data));
  }

  _loadRegionList() {
    return fetch('data/regions.json')
      .then(res => res.json())
      .then(data => {
        this.regionList = data;
        this.regionList.forEach(region => region.selected = region.value === this.data.region);
      });
  }

  _getContent() {
    fetch('data/pages/personal-data-page.json').then(res => res.json()).then(content => {
      this.content = content;
    });
  }

  _loadDataKeys(){
    return fetch('data/form-data.json')
      .then(res => res.json())
      .then(data => {
        if(data){
          this.personalDataKeys = data.personalDataKeys || [];
          this.clinicalDataKeys = data.clinicalDataKeys || [];
        }
      });
  }

  _loadUserDataFromSession() {
    const defaultData = {
      name: '',
      birthDay: '',
      birthMonth: '',
      birthYear: '',
      idNumber: '',
      gender: '',
      address: '',
      postalCode: '',
      region: ''
    };
    const storedData = window.sessionStorage.getItem('userData');
    this.data = storedData ? JSON.parse(storedData) : defaultData;
    this._loadRegionList();
  }

  _onSubmit(e) {
    e.preventDefault();
    this.loading = true;
    this._saveUserData();
    this.validate();
    if (!this.invalid) {
      let personalData = {};
      this.personalDataKeys.forEach(key => {
        personalData[key] = this.data[key]
      });
      let clinicalData = {};
      this.clinicalDataKeys.forEach(key => {
        clinicalData[key] = this.data[key]
      });
      this.dispatchEvent(new CustomEvent('send-personal-data', {
        bubbles: true,
        composed: true,
        detail: {
          data: personalData
        }
      }));
      this.dispatchEvent(new CustomEvent('send-clinical-data', {
        bubbles: true,
        composed: true,
        detail: {
          data: clinicalData
        }
      }));
      window.dispatchEvent(
        new CustomEvent('vaadin-router-go',
          { detail: { pathname: '/symptom-checklist', }, }));
      return;
    }
    this._updateInvalidFields();
  }

  async _updateInvalidFields() {
    await this.requestUpdate('invalidData');
    const invalid = this.shadowRoot.querySelector('[invalid]');
    if (invalid) {
      invalid.scrollIntoView();
    }
  }

  validate() {
    const data = this.data;
    const msg = this.content.error;
    const today = new Date();
    this.resetInvalidData();
    this._checkValid(!data.name, 'name', 'required');
    this._checkValid(data.name && data.name.length < 4, 'name', 'minLength');
    if (this._checkValid(!data.birthDay || !data.birthDay || !data.birthYear, 'birth', 'required')) {
      this._checkValid(data.birthDay < 1 || data.birthDay > 31, 'birth', 'validDay');
      this._checkValid(data.birthMonth < 1 || data.birthMonth > 12, 'birth', 'validMonth');
      this._checkValid(data.birthYear && (data.birthYear.length !== 4 || data.birthYear > today.getUTCFullYear() || data.birthYear < 1900), 'birth', 'validYear');
    }
    this._checkValid(!this._validIdNumber(data.idNumber), 'idNumber', 'valid');
    this._checkValid(!data.gender, 'gender', 'required');
    this._checkValid(!data.address, 'address', 'required');
    this._checkValid(!data.postalCode, 'postalCode', 'required');
    this._checkValid(data.postalCode && data.postalCode.length !== 5, 'postalCode', 'minLength');
    this._checkValid(!data.region, 'region', 'required');
  }

  resetInvalidData() {
    this.invalidData = {
      name: [],
      birth: [],
      idNumber: [],
      gender: [],
      address: [],
      postalCode: [],
      region: []
    };
    this.invalid = false;
  }

  _checkValid(condition, item, msgKey) {
    const msg = this.content.error[item][msgKey];
    if (condition && msg) {
      this.invalidData[item].push(msg);
      this.invalid = true;
      return false;
    }
    return true;
  }

  _validIdNumber(idNumber) {
    let num, lett, letter;
    const regex = /^[XYZ]?\d{5,8}[A-Z]$/;
    idNumber = idNumber.toUpperCase();
    if (regex.test(idNumber) === true) {
      num = idNumber.substr(0, idNumber.length - 1);
      num = num.replace('X', 0);
      num = num.replace('Y', 1);
      num = num.replace('Z', 2);
      lett = idNumber.substr(idNumber.length - 1, 1);
      num = num % 23;
      letter = 'TRWAGMYFPDXBNJZSQVHLCKET';
      letter = letter.substring(num, num + 1);
      if (letter != lett) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}

customElements.define('personal-data-page', PersonalDataPage);
