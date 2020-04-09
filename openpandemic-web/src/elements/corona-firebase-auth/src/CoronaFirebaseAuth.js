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
import { LitElement } from "lit-element";
import firebase from "firebase/app";
import "firebase/auth";

export class CoronaFirebaseAuth extends LitElement {
  static get is() {
    return 'corona-firebase-auth';
  }

  static get properties() {
    return {
      _app: {
        type: Object
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    
    this.shadowHelper = document.createElement('div');
    document.querySelector('body').appendChild(this.shadowHelper);
    if (this.hideBadge) {
      this.shadowHelper.hidden = true;
    }

  }

  async startAuth(){
    if(!this._app) {
      await this._loadApp();
     }

     firebase.auth(this._app).onAuthStateChanged((user) => {

      this.dispatchEvent(new CustomEvent('user-state-changed', {
        bubbles: true,
        composed: true,
        detail: {
          user: user
        }
      }));

      if(user){
        this.dispatchEvent(new CustomEvent('user-sign-in', {
          bubbles: true,
          composed: true,
          detail: {
            user: user
          }
        }));
      } else {
        this.dispatchEvent(new CustomEvent('user-sign-out', {
          bubbles: true,
          composed: true,
          detail: {
            user: user
          }
        }));
      }
    });
  }

  async _loadApp() {
    return fetch('data/firebase-config.json')
    .then(res => res.json())
    .then(data => {
        this._app = firebase.initializeApp(data);
    }).catch(e => {throw new Error("Please include your Firebase Config in data/firebase-config.json");});
  }

  authenticate(phoneNumber) {
    firebase.auth(this._app).useDeviceLanguage();

    this.recaptchaVerifier = this.recaptchaVerifier || new firebase.auth.RecaptchaVerifier(this.shadowHelper, {
      "theme": "light",
      'size': 'invisible',
      'callback': 'handleResponse',
      'badge': 'bottomright',
      'tabindex': 0,
      'type': 'image'
    });
    firebase.auth(this._app).signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier)
      .then((confirmationResult) => {
        this.confirmationResult = confirmationResult;
        this.dispatchEvent(new CustomEvent('auth-sms-sent', {
          bubbles: true,
          composed: true
        }));
        this.recaptchaVerifier.reset();
      }).catch((error) => {
        console.error(error);
        this.recaptchaVerifier.reset();
        this.dispatchEvent(new CustomEvent('auth-sign-in-error', {
          bubbles: true,
          composed: true,
          detail: error
        }));
      });
  }

  confirmCode(code) {
    this.confirmationResult && this.confirmationResult.confirm(code).
    then(() => {
      try {
        window.localStorage.setItem('previouslyLogged', new Date().getTime());
      } catch(e) {
        console.log('Error set item in local storage')
      }
    }).catch(error => {
      console.error(error);
      this.dispatchEvent(new CustomEvent('auth-code-error', {
        bubbles: true,
        composed: true,
        detail: error
      }));
    });
  }

}