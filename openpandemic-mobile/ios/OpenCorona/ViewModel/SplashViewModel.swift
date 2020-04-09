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

// MARK: - Definition
protocol SplashViewModel {
    func navigateToFirstView()
    func animationFinished()
}

// MARK: - Implementation
class SplashViewModelImpl: NSObject, SplashViewModel {
    
    static let checkIfAnimationIsFinishedDelay: TimeInterval = 0.2
    private var timer: Timer?
    
    fileprivate lazy var transition: CATransition = {
        let transition = CATransition()
        transition.type = CATransitionType.fade
        transition.subtype = CATransitionSubtype.fromTop
        transition.duration =  0.250
        return transition
    }()

}

extension SplashViewModelImpl {
    
    func animationFinished() {
        navigateToFirstView()
    }
    
    func navigateToFirstView() {
        
        UIApplication
            .shared
            .keyWindow?
            .rootViewController = DashboardVC(
                nibName: String(describing: DashboardVC.self), bundle: nil)
        
        UIApplication
            .shared
            .keyWindow?
            .layer.add(transition, forKey: kCATransition)
    
    }
    
}
