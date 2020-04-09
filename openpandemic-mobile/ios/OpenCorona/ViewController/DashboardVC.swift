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
import CoreBluetooth
import WebKit
import os

class DashboardVC: UIViewController {
    var centralManager: CBCentralManager!
    var bleManager: BLEManager?

    let persistenceManager = PersistenceManager(
        userDefaults: .standard,
        keychainStore: .internal
    )
        
    @IBOutlet var webView: WKWebView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        bleManager = BLEManager(delegate: self)
        bleManager?.startScan()
        bleManager?.advertising()
        
        webView.navigationDelegate = self
        webView.load(.init(url: CovidEnvironment.environmentURL))
        
        if #available(iOS 11.0, *) {
            webView.scrollView.contentInsetAdjustmentBehavior = .never
        }
    }

}

// MARK: - BLECommunicator
extension DashboardVC: BLECommunicator {
    
    func didStartScanningPeripherals() { os_log(.debug, "Start scanning peripherals 👀") }
    func didStartConfiguration() { os_log(.debug, "Start configuration 🎛") }
    func didStartAdvertising() { os_log(.debug, "Start advertising 📻") }
    func didSendData() { os_log(.debug, "Did send data ⬆️") }
    
    func didReceiveData(contact: Contact) {
        os_log(.debug, "Did received data ⬇️ %@.", String(describing: contact))
        persistenceManager.persistReceived(contact: contact)
    }
    
    func didConnectPeripheral(name: String) { os_log(.debug, "Did connect to %@ 🔌✅", name) }
    
    func didDisconnectPeripheral(name: String) { os_log(.debug, "Did disconnect to %@ 🔌❌", name) }
    
    func didFailConnection() { os_log(.debug, "Did fail in connection 💔") }
    
}

extension DashboardVC: WKNavigationDelegate {
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!){
        persistenceManager.writeInWebLocalStorage(webView: webView)
    }
    
}
