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

import Foundation
import UIKit
import WebKit
import os

final class PersistenceManager {
    let userDefaults: UserDefaults
    let keychainStore: KeychainStore
    
    init(userDefaults: UserDefaults, keychainStore: KeychainStore) {
        self.userDefaults = userDefaults
        self.keychainStore = keychainStore
    }
    
    // MARK: - UserDefaults Storage
    
    func persistReceived(contact: Contact) {
        if let current = userDefaults.intermediateContactFor(id: contact.id) {
            userDefaults.setIntermediateContactValue(
                ContactScanned(
                    id: current.id,
                    timestamp: contact.timestamp,
                    count: current.incrementingCounter().count)
            )
        } else {
            userDefaults.setIntermediateContactValue(
                ContactScanned(
                    id: contact.id,
                    timestamp: contact.timestamp,
                    count: 1
                )
            )
        }
    }
    
    // MARK: - Web Storage
    func writeInWebLocalStorage(webView: WKWebView) {
        
        webView.sendToLocalStorage(
            contacts: ContactsDTO(id: deviceUUID, contacts: userDefaults.allContacts()),
            completion: { [weak self] in
                self?.userDefaults.removeAllFinalContacts()
            }
        )
    }
    
    // MARK: - Keychain Storage
    
    var deviceUUID: String {
        let keychainResult = Result { try keychainStore.getValue(for: "deviceUUID") }
        
        switch keychainResult {
        case let .success(.some(uuid)):
            return uuid
            
        case .success(.none):
            let uuid = UIDevice.current.identifierForVendor?.uuidString
            uuid.map { try? keychainStore.setValue($0, for: "deviceUUID") }
            return uuid ?? ""
            
        case let .failure(error):
            os_log(.error, "Fail in getting value for deviceUUID, error: %@", error.localizedDescription)
            return ""
        }
    }
}
