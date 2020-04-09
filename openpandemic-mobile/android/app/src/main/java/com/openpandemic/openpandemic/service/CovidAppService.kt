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
package com.openpandemic.openpandemic.service

import android.app.ActivityManager
import android.app.Service
import android.bluetooth.BluetoothManager
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.IBinder
import com.openpandemic.openpandemic.repository.BluetoothRepository
import java.util.*

class CovidAppService : Service() {

    companion object {
        const val PREFERENCES_ID = "CoronaPreferences"
        const val USER_PREFERENCES_ID = "UserCoronaPreferences"
        const val UUID_KEY = "id"

        fun isCovidAppServiceRunning(context: Context): Boolean {
            val manager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager?
            manager?.let {
                for (service in manager.getRunningServices(Int.MAX_VALUE)) {
                    if (CovidAppService::class.java.name == service.service.className) {
                        return true
                    }
                }
            }
            return false
        }
    }

    private lateinit var userPreferences: SharedPreferences
    private lateinit var preferences: SharedPreferences
    private lateinit var btRepository: BluetoothRepository

    override fun onCreate() {
        super.onCreate()
        userPreferences = this.getSharedPreferences(USER_PREFERENCES_ID, 0)
        preferences = this.getSharedPreferences(PREFERENCES_ID, 0)
        val btManager = this.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager
        btRepository = BluetoothRepository(this, btManager, preferences)

        val id = userPreferences.getString(UUID_KEY, null)

        if (id == null) {
            val editor = userPreferences.edit()
            editor.putString(UUID_KEY, UUID.randomUUID().toString().substring(0, 13))
            editor.commit()
        }
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        btRepository.startScanning()
        btRepository.startAdvertising(userPreferences.getString("id", null) ?: "")
        return START_STICKY
    }
}