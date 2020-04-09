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
package com.openpandemic.openpandemic.client

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.webkit.GeolocationPermissions
import android.webkit.WebChromeClient
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.openpandemic.openpandemic.module.webview.WebActivity
import com.openpandemic.openpandemic.service.CovidAppService

class CovidChromeClient(private val activity: Activity) : WebChromeClient(), WebActivity.PermissionsCallback {

    companion object {
        const val MY_PERMISSIONS_REQUEST_GEOLOCATION = 100
    }

    private var mOrigin: String? = ""
    private var mCallback: GeolocationPermissions.Callback? = null

    override fun onGeolocationPermissionsShowPrompt(origin: String?, callback: GeolocationPermissions.Callback?) {
        super.onGeolocationPermissionsShowPrompt(origin, callback)

        activity.let {
            if (it is WebActivity) {
                it.permissionsCallback = this
            }

            if (ContextCompat.checkSelfPermission(it, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                if (ActivityCompat.shouldShowRequestPermissionRationale(it, Manifest.permission.READ_CONTACTS)) {
                    // do nothing
                } else {
                    ActivityCompat.requestPermissions(it,
                            arrayOf(Manifest.permission.ACCESS_FINE_LOCATION,
                                    Manifest.permission.ACCESS_COARSE_LOCATION),
                            MY_PERMISSIONS_REQUEST_GEOLOCATION)
                    mCallback = callback
                    mOrigin = origin
                }
            } else {
                callback?.invoke(origin, true, true)
                with(it.applicationContext) {
                    if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                        if (!CovidAppService.isCovidAppServiceRunning(this)) {
                            this.startService(Intent(this, CovidAppService::class.java))
                        }
                    }
                }
            }
        }
    }

    override fun onPermissionsResult(grantResults: IntArray) {
        if ((grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED)) {
            mCallback?.invoke(mOrigin, true, false)
        } else {
            mCallback?.invoke(mOrigin, false, false)
        }
    }
}