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
import Security

public struct KeychainStore {
    let keychainStoreQueryable: KeychainStoreQueryable
    
    public init(keychainStoreQueryable: KeychainStoreQueryable) {
        self.keychainStoreQueryable = keychainStoreQueryable
    }
    
    public func setValue(_ value: String, for key: String) throws {
        guard let encodedPassword = value.data(using: .utf8) else {
            throw KeychainStoreError.string2DataConversionError
        }
        
        var query = keychainStoreQueryable.query
        query[String(kSecAttrAccount)] = key
        
        var status = SecItemCopyMatching(query as CFDictionary, nil)
        switch status {
        case errSecSuccess:
            var attributesToUpdate: [String: Any] = [:]
            attributesToUpdate[String(kSecValueData)] = encodedPassword
            
            status = SecItemUpdate(query as CFDictionary,
                                   attributesToUpdate as CFDictionary)
            if status != errSecSuccess {
                throw error(from: status)
            }
        case errSecItemNotFound:
            query[String(kSecValueData)] = encodedPassword
            
            status = SecItemAdd(query as CFDictionary, nil)
            if status != errSecSuccess {
                throw error(from: status)
            }
        default:
            throw error(from: status)
        }
    }
    
    public func getValue(for key: String) throws -> String? {
        var query = keychainStoreQueryable.query
        query[String(kSecMatchLimit)] = kSecMatchLimitOne
        query[String(kSecReturnAttributes)] = kCFBooleanTrue
        query[String(kSecReturnData)] = kCFBooleanTrue
        query[String(kSecAttrAccount)] = key
        
        var queryResult: AnyObject?
        let status = withUnsafeMutablePointer(to: &queryResult) {
            SecItemCopyMatching(query as CFDictionary, $0)
        }
        
        switch status {
        case errSecSuccess:
            guard
                let queriedItem = queryResult as? [String: Any],
                let passwordData = queriedItem[String(kSecValueData)] as? Data,
                let password = String(data: passwordData, encoding: .utf8)
                else {
                    throw KeychainStoreError.data2StringConversionError
            }
            return password
        case errSecItemNotFound:
            return nil
        default:
            throw error(from: status)
        }
    }
    
    private func error(from status: OSStatus) -> KeychainStoreError {
        let message = SecCopyErrorMessageString(status, nil) as String? ?? NSLocalizedString("Unhandled Error", comment: "")
        return KeychainStoreError.unhandledError(message: message)
    }
}

extension KeychainStore {
    static var `internal`: KeychainStore {
        let genericPassQueryable = GenericPasswordQueryable(service: "internalService")
        return KeychainStore(keychainStoreQueryable: genericPassQueryable)
    }
}
