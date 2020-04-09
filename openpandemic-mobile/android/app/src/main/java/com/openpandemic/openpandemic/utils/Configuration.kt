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
package com.openpandemic.openpandemic.utils

import android.bluetooth.le.AdvertiseSettings

object Configuration {
    const val openpandemic_URL = "CONFIGURE_URL"
    const val ADVERTISE_MODE = AdvertiseSettings.ADVERTISE_MODE_BALANCED
    const val ADVERTISE_TX_POWER = AdvertiseSettings.ADVERTISE_TX_POWER_MEDIUM
    const val TIME_INTERVAL: Long = 20
    const val ENCOUNTERS = 4
    const val WEB_DEBUG = false
    const val DISTANCE_THRESHOLD = 2
}