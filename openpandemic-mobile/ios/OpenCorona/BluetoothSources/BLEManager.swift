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

import UIKit
import Foundation
import CoreBluetooth
import os

class BLEManager: NSObject {
    // MARK: - Properties
    let serviceUUID: String = "8359cc8e-5fc3-4e8e-afe8-2b1ba62c14b0" // Service UUID
    let characteristicUUID: String = "772C7041-CF92-4458-87DC-37903AC0752F" // Characteristic UUID
    var serviceCBUUID: CBUUID?
    var characteristicCBUUID: CBUUID?
    var communicator: BLECommunicator?
    var centralManager: CBCentralManager?
    var peripheralManager: CBPeripheralManager?
    var discoveredPeripheral: [CBPeripheral] = []
    let backgroundQueue = DispatchQueue.global(qos: .background)
    var service: CBMutableService?
    var characteristic: CBMutableCharacteristic?
    let properties: CBCharacteristicProperties = [.read, .notify, .writeWithoutResponse, .write]
    let permissions: CBAttributePermissions = [.readable, .writeable]
    
    var connectedCentral: CBCentral?
    var dataToSend: Data = Data()
    var sendDataIndex: Int = 0
    
    private static let dateFormatter = configure(DateFormatter()) {
        $0.dateFormat = "yyyy-MM-dd HH:mm"
        $0.timeZone = TimeZone(secondsFromGMT: 0)
    }
    
    let nowDateString: String = BLEManager.dateFormatter.string(from: Date())

    // MARK: - Initializers
    convenience init (delegate: BLECommunicator) {
        self.init()
        self.communicator = delegate
        guard
            let serviceUUID: UUID = NSUUID(uuidString: self.serviceUUID) as UUID?,
            let characteristicUUID: UUID = NSUUID(uuidString: self.characteristicUUID) as UUID?
            else { return }
        self.serviceCBUUID = CBUUID(nsuuid: serviceUUID)
        self.characteristicCBUUID = CBUUID(nsuuid: characteristicUUID)
        guard
            let serviceCBUUID: CBUUID = self.serviceCBUUID,
            let characteristicCBUUID: CBUUID = self.characteristicCBUUID
            else { return }
        // Configuring service
        self.service = CBMutableService(type: serviceCBUUID, primary: true)
        // Configuring characteristic
        self.characteristic = CBMutableCharacteristic(type: characteristicCBUUID, properties: self.properties, value: nil, permissions: self.permissions)
        guard let characteristic: CBCharacteristic = self.characteristic else { return }
        // Add characterisct to service
        self.service?.characteristics = [characteristic]
        self.communicator?.didStartConfiguration()
        
        Timer.scheduledTimer(withTimeInterval: Config.timeInterval, repeats: true) { _ in
            let userDefaults = UserDefaults.standard
            let filteredContacts = userDefaults
                .allIntermediateContacts()
                .filter { $0.count > Config.encounters }
            
            if filteredContacts.isEmpty { return }
            
            let contacts = filteredContacts.map { Contact(id: $0.id, timestamp: $0.timestamp) }

            userDefaults.appendFinalContactsReplacing(contentsOf: contacts)
            userDefaults.removeAllIntermediateContacts()
        }
        
    }
    // MARK: - Functions
    func startScan() {
        self.centralManager = CBCentralManager(delegate: self, queue: backgroundQueue)
    }
    
    func advertising() {
        self.peripheralManager = CBPeripheralManager(delegate: self, queue: backgroundQueue)
    }
    
}

extension BLEManager: CBCentralManagerDelegate {
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        os_log(.debug,"\ncentralManagerDidUpdateState %@", nowDateString)
        if central.state == .poweredOn {
            guard let serviceCBUUID: CBUUID = self.serviceCBUUID else { return }
            self.communicator?.didStartScanningPeripherals()
            self.centralManager?.scanForPeripherals(withServices: [serviceCBUUID], options: [CBCentralManagerScanOptionAllowDuplicatesKey: true])
        }
    }
    func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
        if RSSI.rssToDistance() > Config.distanceThreshold {
            return
        }
        // We must keep a reference to the new discovered peripheral, which means we must retain it.
        if !discoveredPeripheral.contains(peripheral) {
            discoveredPeripheral.append(peripheral)
        }
        if let adevtiserDict = advertisementData[CBAdvertisementDataServiceDataKey] as? NSDictionary,
            let contactIdData = adevtiserDict.allValues.first as? NSData,
            let contactId = String(data: contactIdData as Data, encoding: .utf8) {
            os_log(.debug, "Android device discover.")
            self.communicator?.didReceiveData(contact: .init(id: contactId, timestamp: String(describing:Date().timeIntervalSince1970 * 1000)))
        } else {
            os_log(.debug, "iOS device discover.")
            peripheral.delegate = self
            self.centralManager?.connect(peripheral, options: nil)
        }
    }
    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        os_log(.debug,"\ndidConnect to %@", peripheral.name ?? "")
        self.communicator?.didConnectPeripheral(name: peripheral.name ?? "")
        guard let serviceCBUUID: CBUUID = self.serviceCBUUID else { return }
        peripheral.discoverServices([serviceCBUUID])
    }
    func centralManager(_ central: CBCentralManager, didFailToConnect peripheral: CBPeripheral, error: Error?) {
        os_log(.debug,"\ndidFailToConnect")
        self.communicator?.didFailConnection()
    }
    func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
        os_log(.debug,"\ndidDisconnectPeripheral %@", peripheral.name ?? "")
        self.communicator?.didDisconnectPeripheral(name: peripheral.name ?? "")
    }
}

// MARK: - CBPeripheralDelegate
extension BLEManager: CBPeripheralDelegate {
    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        os_log(.debug,"\ndidDiscoverServices %@", String(describing:peripheral.services))
        if let service: CBService = peripheral.services?.filter({ $0.uuid == self.serviceCBUUID }).first {
            guard let characteristicCBUUID: CBUUID = self.characteristicCBUUID else {
                return
            }
            peripheral.discoverCharacteristics([characteristicCBUUID], for: service)
        }
        
    }
    func peripheral(_ peripheral: CBPeripheral, didWriteValueFor characteristic: CBCharacteristic, error: Error?) {
        os_log(.debug,"didWriteValueFor %@", nowDateString)
        // After we write data on peripheral, we disconnect it.
        self.centralManager?.cancelPeripheralConnection(peripheral)
        // We stop scanning.
        self.centralManager?.stopScan()
    }
    func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
        os_log(.debug,"\ndidDiscoverCharacteristicsFor")
        if let characteristic: CBCharacteristic = service.characteristics?.filter({ $0.uuid == self.characteristicCBUUID }).first {
            os_log(.debug,"Matching characteristic")
            peripheral.readValue(for: characteristic)
        }
    }
    func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
        os_log(.debug,"\ndidUpdateValueFor")
        // We read
        if let value: Data = characteristic.value,
            let receivedIdentifier: String = String(data: value, encoding: .utf8) {
            os_log(.debug,"Value read is:%@", receivedIdentifier)
            
            self.communicator?.didReceiveData(contact: .init(id: receivedIdentifier, timestamp: String(describing:Date().timeIntervalSince1970 * 1000))) // timestamp in millisecond like Android platform.
            self.centralManager?.cancelPeripheralConnection(peripheral)
            guard let name = peripheral.name else {return}
            self.communicator?.didDisconnectPeripheral(name: name)
        }
    }
    
}

// MARK: - CBPeripheralDelegate
extension BLEManager: CBPeripheralManagerDelegate {
    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        os_log(.debug,"peripheralManagerDidUpdateState")
        if peripheral.state == .poweredOn {
            guard let service: CBMutableService = self.service else { return }
            self.peripheralManager?.removeAllServices()
            self.peripheralManager?.add(service)
        }
    }
    
    func peripheralManager(_ peripheral: CBPeripheralManager, didAdd service: CBService, error: Error?) {
        os_log(.debug,"\ndidAdd service")
        
        let advertisingData: [String: Any] = [
            CBAdvertisementDataServiceUUIDsKey: [self.service?.uuid]
        ]
        self.peripheralManager?.stopAdvertising()
        self.peripheralManager?.startAdvertising(advertisingData)
    }
    func peripheralManagerDidStartAdvertising(_ peripheral: CBPeripheralManager, error: Error?) {
        os_log(.debug,"peripheralManagerDidStartAdvertising")
        self.communicator?.didStartAdvertising()
    }
    // Read static values
    // Called when CBPeripheral .readValue(for: characteristic) is called from the central
    func peripheralManager(_ peripheral: CBPeripheralManager, didReceiveRead request: CBATTRequest) {
        os_log(.debug,"\ndidReceiveRead request")
        if let uuid: CBUUID = self.characteristic?.uuid,
            request.characteristic.uuid == uuid {
            
            let identifierVendor = PersistenceManager(userDefaults: .standard, keychainStore: .internal).deviceUUID
            os_log(.debug,"Match characteristic for static reading")
            request.value = String(describing: identifierVendor).data(using: .utf8)
            self.peripheralManager?.respond(to: request, withResult: .success)
            self.communicator?.didSendData()
        }
    }
    
}

// MARK: - Utilities

extension NSNumber {
    func rssToDistance() -> Double {
        return pow(10.0, (-65.0 - Double(truncating: self)) / (10.0 * 2))
    }
}

func configure<T>(_ object: T, using closure: (inout T) -> Void) -> T {
    var object = object
    closure(&object)
    return object
}
