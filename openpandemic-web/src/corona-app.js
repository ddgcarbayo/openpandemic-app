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
import themeStyles from './elements/styles/theme.js';
import pageTransitionStyles from './elements/styles/page-transitions.js';
import './pages/login-page.js';
import './pages/confirm-code-page.js';
import './pages/personal-data-page.js';
import './pages/symptom-checklist-page.js';
import './pages/recommendation-no-symptoms-page.js';
import './pages/recommendation-symptoms-page.js';
import './pages/autoevaluation-result-no-symptoms-page.js'
import './pages/autoevaluation-result-symptoms-page.js';
import './pages/qr-page.js';
import './pages/location-permission-page.js';
import './pages/bluetooth-permission-page.js';
import './pages/home-page.js';
import './pages/security-policy-page.js';
import './pages/conditions-use-page.js';
import './elements/corona-firebase-auth/corona-firebase-auth.js';
import './elements/corona-firebase-database/corona-firebase-database.js';
import './elements/corona-firebase-functions/corona-firebase-functions.js';
import './elements/corona-spinner/corona-spinner.js';


import { Router, Resolver } from '@vaadin/router';

class CoronaApp extends LitElement {

  static get properties() {
    return {
      uid: {
        type: String
      },
      locationHighAccuracy: {
        type: Boolean
      },
      _db: {
        type: Object
      },
      _locationPermissionKey: {
        type: String
      },
      _bluetoothPermissionKey: {
        type: String
      },
      _functions: {
        type: Object
      }
    }
  }

  get db() {
    if(!this._db) {
      this._db = this.shadowRoot.getElementById("db");
    }
    return this._db;
  }
  get functions() {
    if(!this._functions) {
      this._functions = this.shadowRoot.getElementById("functions");
    }
    return this._functions;
  }
  constructor(){
    super();
    this.ensureSessionStorage();
    this.locationHighAccuracy = false;
    this._locationPermissionKey = 'locationPermissionUser';
    this._bluetoothPermissionKey = 'bluetoothPermissionUser';
    window.sessionStorage.setItem('loaded', false);
  }

  async firstUpdated() {
    const router = new Router(this.shadowRoot.getElementById('outlet'));
    await this._loadAppConfig();
    const trackingIsEnabled = window.sessionStorage.getItem('enableContactTracking') === 'true';
    const permissionPage = trackingIsEnabled ? 'bluetooth-permission-page' : 'location-permission-page';
    router.setRoutes([{
      path: '/',
      animate: true,
      children: [
        {path: '', component: 'home-page'},
        {path: '/login', component: 'login-page'},
        {path: '/permissions', component: permissionPage},
        {path: '/confirm-code', component: 'confirm-code-page'},
        {path: '/personal-data', component: 'personal-data-page'},
        {path: '/symptom-checklist', component: 'symptom-checklist-page'},
        {path: '/recommendations-no-symptoms', component: 'recommendation-no-symptoms-page'},
        {path: '/recommendations-symptoms', component: 'recommendation-symptoms-page'},
        {path: '/security-policy', component: 'security-policy-page'},
        {path: '/conditions-use', component: 'conditions-use-page'},
        {path: '/autoevaluation-result-no-symptoms', component: 'autoevaluation-result-no-symptoms-page'},
        {path: '/autoevaluation-result-symptoms', component: 'autoevaluation-result-symptoms-page'},
        {path: '/qr', component: 'qr-page'},
        {path: '(.*)', component: 'home-page'}
      ]
    }]);
    this._addListeners();
  }

  switchRoute(route) {
    this.activeTab = route;
    Router.go(`/${route}`);
  }

  ensureSessionStorage() {
    if (!window.sessionStorage) {
      window.sessionStorage = {
        items: {},
        setItem(key, item) {
          window.sessionStorage.items[key] = item;
        },
        getItem(key) {
          window.sessionStorage.items[key] || null;
        },
        clear() {
          window.sessionStorage.items = {};
        }
      };
    }
  }

  static get styles() {
    return [themeStyles, pageTransitionStyles];
  }

  render() {
    return html`
      <div id="outlet" style="height:var(--container-outlet, 100%)"></div>
      <corona-firebase-auth id="auth"></corona-firebase-auth>
      <corona-firebase-database id="db"></corona-firebase-database>
      <corona-firebase-functions id="functions"></corona-firebase-functions>
    `;
  }

  async _initFirebase(){
    await this.shadowRoot.getElementById("auth").startAuth();
    this.db.startDb();
  }

  _loginRequest(e){
    let phoneNumber = e.detail.prefix || "" ;
    phoneNumber += e.detail.phoneNumber;
    this.shadowRoot.getElementById("auth").authenticate(phoneNumber);
    window.sessionStorage.setItem('phoneNumber', phoneNumber);
  }
  _confirmCode(e){
    this.shadowRoot.getElementById("auth").confirmCode(e.detail.code);
  }
  _smsSent() {
    this.switchRoute('confirm-code');
  }

  getLastEvaluationData(uid) {
    const docRef = this.db.db.collection('person').doc(uid).collection('test');
    const functions = this.functions;
    window.sessionStorage.removeItem('result');
    window.sessionStorage.removeItem('lastEvaluationTime');
    return docRef.get().then(function (doc) {
      let tests = doc.docs;
      let lastTest = doc.docs.length ? tests[0].data() : undefined;
      lastTest.id = tests[0].id;
      tests.forEach(t => {
        if (t.data().time>lastTest.time) {
          lastTest = t.data();
          lastTest.id = t.id;
        }
      });
      window.sessionStorage.setItem('result', lastTest.result);
      window.sessionStorage.setItem('lastEvaluationTime', lastTest.time);
      window.sessionStorage.setItem('lastTestId', lastTest.id);
      lastTest && functions.getQrCode(lastTest.id).then(qrCode => {
        window.sessionStorage.setItem('qrCode', qrCode);
      });
      return lastTest;
    }).catch(function (error) {
      console.log("Error getting last evaluation:", error);
    });
  }

  _loginSuccess(e) {
    const trackingIsEnabled = window.sessionStorage.getItem('enableContactTracking') === 'true';
    this.db.uid = e.detail.user.uid;
    this.getLastEvaluationData(this.db.uid).then(() => {
      if(window.localStorage.getItem('previouslyLogged')){
        this.switchRoute('permissions');
      }
    });
    if (trackingIsEnabled) {
      this.searchPositiveContacts();
    }
  }

  _firebaseStateChanged(e){
    const loginPage = this.shadowRoot.querySelector("login-page");
    let logged = window.localStorage.getItem('previouslyLogged');
    if(loginPage && !logged){
      loginPage.spinner = false;
    }
  }

  _smsCodeError(){
    const confirmPage = this.shadowRoot.querySelector("confirm-code-page");
    if(confirmPage){
      confirmPage.invalid = true;
    }
  }
  _loginError(){
    const loginPage = this.shadowRoot.querySelector("login-page");
    if(loginPage){
      loginPage.invalid = true;
    }
  }
  _addListeners() {
    this.addEventListener('login-request', this._loginRequest);
    this.addEventListener('new-sms-request', this._loginRequest);
    this.addEventListener('user-sign-in', this._loginSuccess);
    this.addEventListener('sms-validation-request', this._confirmCode);
    this.addEventListener('auth-sms-sent', this._smsSent);
    this.addEventListener('auth-code-error', this._smsCodeError);
    this.addEventListener('auth-sign-in-error', this._loginError);
    this.addEventListener('send-personal-data', this._sendPersonalData);
    this.addEventListener('send-clinical-data', this._sendClinicalData);
    this.addEventListener('test-result', this._sendTestResult);
    this.addEventListener('start-flow', this._initFirebase);
    this.addEventListener('user-state-changed', this._firebaseStateChanged);
  }

  async _sendPersonalData(e) {
    await this.db.addPersonalData(e.detail.data);
    const personData = {};
    const phoneNumber = window.sessionStorage.getItem('phoneNumber');
    if(phoneNumber) {
      personData.phoneNumber = phoneNumber;
    }
    const country = window.sessionStorage.getItem('country');
    if(country) {
      personData.country = country;
    }
    this.db.addPerson(personData);
  }

  _sendClinicalData(e) {
    this.db.addClinicalData(e.detail.data);
  }

  async _sendTestResult(e) {
    const locationPermission = window.localStorage.getItem(this._locationPermissionKey);
    const bluetoothPermission = window.localStorage.getItem(this._bluetoothPermissionKey);

    const time = new Date().getTime();
    e.detail.data.time = time;

    const addTest = test => {
      this.db.addTest(test).then(id=>{
        this.functions.getQrCode(id).then(qrCode => {
        window.sessionStorage.setItem('qrCode', qrCode);
      })});
    }
    if(e.detail.data.result === 'symptoms'){
      const contactsInfo = this._getContactInfo();
      if(contactsInfo && contactsInfo['contact-id']){
        await this.db.addContactId(contactsInfo['contact-id']);
      }
    }
    if(locationPermission || bluetoothPermission) {
      navigator.geolocation && navigator.geolocation.getCurrentPosition((location) => {
        e.detail.data.location = {
          lat : location.coords.latitude,
          long: location.coords.longitude,
          isHighAccuracy: this.locationHighAccuracy
        };
        addTest(e.detail.data);
      }, (error) => {
        addTest(e.detail.data);
        console.warn(error);
      }, { enableHighAccuracy: this.locationHighAccuracy, timeout: 5000, maximumAge: 0 });
    } else{
      addTest(e.detail.data);
    }
    
  }

  _logout() {
    const homePage = this.shadowRoot.querySelector("home-page");
    window.sessionStorage.setItem('loaded', true);
    if(homePage){
      homePage.loaded = true;
    } else {
      this.switchRoute('home-page');
    }
  }

  async _loadAppConfig() {
    return fetch('data/app-config.json')
      .then(res => res.json())
      .then(data => {
        if (data) {
          this.locationHighAccuracy = data.locationHighAccuracy;
          window.sessionStorage.setItem('enablePersonalData', data.enablePersonalData);
          window.sessionStorage.setItem('waitTimeForNextAutoevaluation', data.waitTimeForNextAutoevaluation);
          window.sessionStorage.setItem('enableContactTracking', data.enableContactTracking);
          window.sessionStorage.setItem('country', data.country);
        }
      });
  }

  async searchPositiveContacts() {
    let positive = await this.db.getPositiveList();
    let contactsInfo = this._getContactInfo();
    const contactIds = contactsInfo.contacts.map(c => c['contact-id']);
    let i = 0;
    let found = false;
    while (i<contactIds.length && !found) {
      found = positive.indexOf(contactIds[i]) >= 0;
      i++;
    }
    if (found) {
      window.sessionStorage.setItem('closeToPersonWithSymptoms', 'true');
    } else {
      window.sessionStorage.removeItem('closeToPersonWithSymptoms');
    }
  }

  _getContactInfo(){
    let contactsInfo = window.localStorage.getItem('contact-list');
    contactsInfo = contactsInfo || '{}';
    try{
      contactsInfo = JSON.parse(contactsInfo);
    } catch(e){
      contactsInfo = {};
    }
    contactsInfo.contacts = contactsInfo.contacts || [];
    return contactsInfo;
  }
}

customElements.define('corona-app', CoronaApp);
