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
import "firebase/functions";

export class CoronaFirebaseFunctions extends LitElement {
  static get is() {
    return 'corona-firebase-functions';
  }

  static get properties() {
    return {
      _functions: {
        type: Object
      }
    }
  }

  get functions() {
    if(!this._functions) {
      this._functions = firebase.functions();
    }
    return this._functions;
  }

  async getQrCode(id) {
    var getQrCode = this.functions.httpsCallable('qrcode-get');
    return getQrCode({id}).then((response) => {
      this.dispatchEvent(new CustomEvent('qr-code-fetched', {
        bubbles: true,
        composed: true,
        detail: {qrcode: response.data.code}
      }));
      return response.data.code;
    }).catch((error) => {
      this.dispatchEvent(new CustomEvent('qr-code-error', {
        bubbles: true,
        composed: true,
        detail: {error}
      }));
    });
    ;
  }
}