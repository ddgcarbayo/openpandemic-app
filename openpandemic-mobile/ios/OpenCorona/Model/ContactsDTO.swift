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

// MARK: - ContactsDTO
struct ContactsDTO: Codable {
    let id: String
    let contacts: [Contact]

    enum CodingKeys: String, CodingKey {
        case id = "contact-id"
        case contacts
    }
}

// MARK: - Constact
struct Contact: Codable {
    let id: String
    let timestamp: String

    enum CodingKeys: String, CodingKey {
        case id = "contact-id"
        case timestamp
    }
}

struct ContactScanned {
    let id: String
    let timestamp: String
    let count: Int
}

extension ContactScanned {
    func incrementingCounter() -> ContactScanned {
        return ContactScanned(id: id, timestamp: timestamp, count: count + 1)
    }
}
