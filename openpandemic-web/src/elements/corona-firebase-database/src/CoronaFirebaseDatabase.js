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
import "firebase/firestore";

export class CoronaFirebaseDatabase extends LitElement {
  static get is() {
    return 'corona-firebase-database';
  }

  static get properties() {
    return {
      db: {
        type: Object
      },
      uid: {
        type: String
      }
    }
  }

  startDb(){
    this.db = firebase.firestore();
  }

  addPersonalData(data) {
    this.db.collection('person').doc(this.uid).set({ 'personal-data': data }, { merge: true });
  }
  
  addPerson(data) {
    this.db.collection('person').doc(this.uid).set(data, { merge: true });
  }

  addTest(test) {
    return this.db.collection('person').doc(this.uid).collection('test').add(test).then(test => {
      window.sessionStorage.setItem('lastTestId', test.id);
      return test.id;
    });
  }

  addClinicalData(data) {
    this.db.collection('person').doc(this.uid).set({ 'clinical-data': data }, { merge: true });
  }

  getPersonalData() {
    var docRef = this.db.collection("person").doc(this.uid);

    docRef.get().then(function (doc) {
      if (doc.exists) {
        return doc.data()['personal-data'];
      } else {
        return;
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });
  }

  async addContactId(id){
    var docRef = this.db.collection("person").doc(this.uid);
    return this.db.runTransaction((transaction) => {
      return transaction.get(docRef).then((person) => {
        if(person.exists){
          let contactIds = person.get('contact-ids') || [];
          if(contactIds.indexOf(id) < 0) {
            contactIds.push(id);
            transaction.update(docRef, { 'contact-ids': contactIds });
          }
        }
      });
    });
  }

  getPositiveList() {
    const docRef = this.db.collection('positive-contacts');
    return docRef.get()
      .then(doc => {
        const list = doc.docs.map(item => item.id);
        return list;
      })
      .catch(function (error) {
        console.log("Error getting list:", error);
      });
  }
}