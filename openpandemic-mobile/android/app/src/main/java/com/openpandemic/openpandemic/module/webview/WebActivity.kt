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
package com.openpandemic.openpandemic.module.webview

import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.openpandemic.openpandemic.R
import com.openpandemic.openpandemic.bridge.CovidWebViewManager
import com.openpandemic.openpandemic.client.CovidChromeClient
import com.openpandemic.openpandemic.client.CovidCoronaWebViewClient
import com.openpandemic.openpandemic.service.CovidAppService
import com.openpandemic.openpandemic.utils.Configuration
import kotlinx.android.synthetic.main.activity_webview.*

class WebActivity : AppCompatActivity() {

    companion object {
        const val PERMISSIONS_REQUEST_GEOLOCATION = 100
    }

    interface PermissionsCallback {
        fun onPermissionsResult(grantResults: IntArray)
    }

    var permissionsCallback: PermissionsCallback? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_webview)
        prepareSplash()

        webview.apply {
            CovidWebViewManager(this)
            loadUrl(Configuration.openpandemic_URL)
            webChromeClient = CovidChromeClient(this@WebActivity)
            webViewClient = CovidCoronaWebViewClient(this@WebActivity)
        }
    }

    private fun prepareSplash() {
        with(splash_view) {
            this.postDelayed({
                onSplashFinish()
            }, 2000)
        }
    }

    private fun onSplashFinish() {
        splash_view.visibility = View.GONE
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        when (requestCode) {
            PERMISSIONS_REQUEST_GEOLOCATION -> {
                permissionsCallback?.onPermissionsResult(grantResults)

                if ((grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)) {
                    if (!CovidAppService.isCovidAppServiceRunning(this)) {
                        this.startService(Intent(this, CovidAppService::class.java))
                    }
                }
                return
            }
        }
    }

    override fun onBackPressed() {}
}