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
import os
import UIKit

enum CovidEnvironment {
        
    static var environmentURL: URL = {
        return URL(string: Config.openpandemicURL)!
    }()
}

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        let splashViewModel = SplashViewModelImpl()
        let splashVC = SplashVC(viewModel: splashViewModel)
        
        window = UIWindow(frame: UIScreen.main.bounds)
        window?.rootViewController = splashVC
        window?.makeKeyAndVisible()
        
        return true
    }
}
