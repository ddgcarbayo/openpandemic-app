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

let userIntermediateListKey = "com_openpandemic_openpandemic_intermediate_contacts"
let userListKey = "com_openpandemic_openpandemic_contacts"
 
extension UserDefaults {
    func intermediateContactFor(id: String) -> ContactScanned? {
        let contactDict = allIntermediateContactsDict()[id] as? [String: NSNumber]
        return contactDict?.first.map {
            ContactScanned(id: id, timestamp: $0.key, count: $0.value.intValue)
        }
    }
    
    func setIntermediateContactValue(_ contact: ContactScanned) {
        let contactDict = [contact.timestamp: NSNumber(integerLiteral: contact.count)]
        
        var allContacts = allIntermediateContactsDict()
        allContacts[contact.id] = contactDict
        setValue(allContacts, forKey: userIntermediateListKey)
    }
    
    func allIntermediateContacts() -> [ContactScanned] {
        return allIntermediateContactsDict().keys.compactMap(intermediateContactFor(id:))
    }
    
    func removeAllIntermediateContacts() {
        removeObject(forKey: userIntermediateListKey)
    }
    
    func appendFinalContactsReplacing(contentsOf contacts: [Contact]) {
        var listFinalContacts: [Contact]
        if let storedData = allFinalContacts(), let finalContacts = try? PropertyListDecoder().decode(Array<Contact>.self, from: storedData) {
            listFinalContacts = finalContacts
        } else {
            listFinalContacts = []
        }
        
        contacts.forEach { (newContact: Contact) in
            listFinalContacts.removeAll { $0.id == newContact.id }
        }
        
        listFinalContacts.append(contentsOf: contacts)
        
        setValue(try? PropertyListEncoder().encode(listFinalContacts), forKey: userListKey)
    }
    
    func removeAllFinalContacts() {
        removeObject(forKey: userListKey)
    }
    
    func allContacts() -> [Contact] {
        var listFinalContacts: [Contact]
        if let storedData = allFinalContacts(), let finalContacts = try? PropertyListDecoder().decode(Array<Contact>.self, from: storedData) {
            listFinalContacts = finalContacts
        } else {
            listFinalContacts = []
        }
        return listFinalContacts
    }
    
    private func allIntermediateContactsDict() -> [String: Any] {
        if let allContacts = dictionary(forKey: userIntermediateListKey) {
            return allContacts
        } else {
            setValue([:], forKey: userIntermediateListKey)
            return [:]
        }
    }
    
    private func allFinalContacts() -> Data? {
        if let allContacts = value(forKey: userListKey) as? Data {
            return allContacts
        } else {
            return nil
        }
    }
    
}
