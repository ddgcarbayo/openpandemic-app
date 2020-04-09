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
import WebKit
import os

extension WKWebView {
    func sendToLocalStorage(contacts: ContactsDTO, completion: @escaping () -> Void) {
        let encodedContactsResult = Result {
            try JSONEncoder().encode(contacts)
        }.map {
            String(data: $0, encoding: .utf8)
        }.map { jsonString -> String? in
            return jsonString.map {
                return """
                localStorage.setItem('contact-list','\($0)');
                localStorage.getItem('contact-list');
                """
            }
        }
        
        switch encodedContactsResult {
        case let .success(json?):
            evaluateJavaScript(json, completionHandler: { value, error in
                if let error = error {
                    os_log(.debug, "Error storing data in webside, %@", error.localizedDescription)
                } else {
                    os_log(.debug, "Stored data in webside %@", String(describing: value))
                    completion()
                }
            })
        case let .failure(error):
            os_log(.debug, "%@ encoding fails with error %@", String(describing: ContactsDTO.self), error.localizedDescription)
        default:
            os_log(.debug, "Data could not be converted to JSON String")
        }
    }
}
