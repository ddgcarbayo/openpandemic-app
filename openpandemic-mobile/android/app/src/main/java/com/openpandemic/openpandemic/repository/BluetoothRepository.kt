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
package com.openpandemic.openpandemic.repository

import android.annotation.SuppressLint
import android.bluetooth.BluetoothGatt
import android.bluetooth.BluetoothGattCallback
import android.bluetooth.BluetoothGattCharacteristic
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothProfile
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanResult
import android.content.Context
import android.content.SharedPreferences
import android.os.ParcelUuid
import com.openpandemic.openpandemic.extensions.rssiToDistance
import com.openpandemic.openpandemic.model.BluetoothRegister
import com.openpandemic.openpandemic.utils.Configuration.ADVERTISE_MODE
import com.openpandemic.openpandemic.utils.Configuration.ADVERTISE_TX_POWER
import com.openpandemic.openpandemic.utils.Configuration.DISTANCE_THRESHOLD
import com.openpandemic.openpandemic.utils.Configuration.ENCOUNTERS
import com.openpandemic.openpandemic.utils.Configuration.TIME_INTERVAL
import com.google.gson.Gson
import io.reactivex.subjects.PublishSubject
import java.nio.charset.Charset
import java.util.*
import java.util.concurrent.TimeUnit

@SuppressLint("CheckResult")
class BluetoothRepository(private val context: Context, private val btManager: BluetoothManager, private val preferences: SharedPreferences) {

    companion object {
        private val ADVERTISE_UUID = UUID.fromString("8359cc8e-5fc3-4e8e-afe8-2b1ba62c14b0")
        private val CHARACTERISTIC_UUID = UUID.fromString("772C7041-CF92-4458-87DC-37903AC0752F")
    }

    private val publisher = PublishSubject.create<BluetoothRegister>()
    private val gson = Gson()

    private val scanCallback = object : ScanCallback() {
        override fun onScanResult(callbackType: Int, result: ScanResult) {
            onScanEvent(result)
        }

        override fun onScanFailed(errorCode: Int) {
            super.onScanFailed(errorCode)
        }

        override fun onBatchScanResults(results: MutableList<ScanResult>) {
            super.onBatchScanResults(results)
        }
    }

    private val advertisingCallback = object : AdvertiseCallback() {
        override fun onStartSuccess(settingsInEffect: AdvertiseSettings?) {
            super.onStartSuccess(settingsInEffect)
        }

        override fun onStartFailure(errorCode: Int) {
            super.onStartFailure(errorCode)
        }
    }

    private val gattCallback = object : BluetoothGattCallback() {
        override fun onConnectionStateChange(gatt: BluetoothGatt?, status: Int, newState: Int) {
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                gatt?.discoverServices()
            }
        }

        override fun onCharacteristicRead(gatt: BluetoothGatt?, characteristic: BluetoothGattCharacteristic?, status: Int) {
            characteristic?.let { characteristicFound ->
                String(characteristicFound?.value, Charset.forName("utf-8")).let { gattDeviceID ->
                    publisher.onNext(BluetoothRegister(gattDeviceID, System.currentTimeMillis()))
                }
            }
        }

        override fun onServicesDiscovered(gatt: BluetoothGatt?, status: Int) {
            if (status != BluetoothGatt.GATT_SUCCESS) {
                gatt?.close()
                return
            }

            val characteristic = gatt?.getService(ADVERTISE_UUID)?.getCharacteristic(CHARACTERISTIC_UUID)

            if (characteristic != null) {
                gatt.readCharacteristic(characteristic)
            } else {
                gatt?.close()
            }
        }
    }

    init {
        publisher.buffer(TIME_INTERVAL, TimeUnit.SECONDS)
                .forEach { reg ->
                    reg.groupBy {
                        it.contactID
                    }.filter {
                        it.value.size > ENCOUNTERS
                    }.forEach {
                        val item = it.value[it.value.lastIndex]

                        val serializedRegister = gson.toJson(item)
                        val editor = preferences.edit()

                        if (preferences.contains(item.contactID)) {
                            editor?.remove(item.contactID)
                        }

                        editor?.putString(item.contactID, serializedRegister)
                        editor?.commit()
                    }
                }
    }

    private fun onScanEvent(result: ScanResult) {
        if (result.scanRecord?.serviceUuids?.contains(ParcelUuid(ADVERTISE_UUID)) == true
                && result.scanRecord?.bytes != null) {

            if (result.rssi.rssiToDistance() < DISTANCE_THRESHOLD) {
                val deviceID = getDeviceID(result.scanRecord?.bytes!!)

                deviceID?.let {
                    val timestamp = System.currentTimeMillis()
                    val register = BluetoothRegister(
                            deviceID,
                            timestamp)

                    publisher.onNext(register)
                } ?: getDeviceIDFromGattServer(result)
            }
        }
    }

    private fun isBluetoothEnabled(): Boolean {
        return btManager.adapter.isEnabled
    }

    private fun getDeviceIDFromGattServer(result: ScanResult) {
        val mac = result.device.address
        val device = btManager.adapter?.getRemoteDevice(mac)
        device?.connectGatt(context, false, gattCallback)
    }

    private fun getDeviceID(bytes: ByteArray): String? {
        val result = ByteArray(12)

        var currIndex = 0
        var len = -1
        var type: Byte

        while (currIndex < bytes.size && len != 0) {
            len = bytes[currIndex].toInt()
            type = bytes[currIndex + 1]

            if (type == 0x21.toByte()) {
                bytes.copyInto(result, 0, currIndex + 2 + 16, currIndex + 2 + 16 + 12)
                break
            } else if (type == 0x16.toByte()) {
                bytes.copyInto(result, 0, currIndex + 2 + 2, currIndex + 2 + 2 + 12)
                break
            } else if (type == 0x20.toByte()) {
                bytes.copyInto(result, 0, currIndex + 2 + 4, currIndex + 2 + 4 + 12)
                break
            } else {
                currIndex += len + 1
            }
        }

        return if (isByteAllZeros(result)) {
            null
        } else {
            val resultDeviceName = String(result, Charset.forName("utf-8"))
            if (resultDeviceName.isNotEmpty()) resultDeviceName else null
        }
    }

    fun startScanning() {
        if (isBluetoothEnabled()) {
            btManager.adapter.bluetoothLeScanner.startScan(scanCallback)
        }
    }

    fun startAdvertising(deviceID: String) {
        deviceID.let {
            if (deviceID.isNotEmpty()) {
                if (isBluetoothEnabled()) {
                    val parcelUuid = ParcelUuid(ADVERTISE_UUID)
                    val data = AdvertiseData.Builder()
                            .setIncludeDeviceName(false)
                            .addServiceUuid(parcelUuid)
                            .build()

                    val scanData = AdvertiseData.Builder()
                            .addServiceData(parcelUuid, deviceID.toByteArray())
                            .build()

                    val settings = AdvertiseSettings.Builder()
                            .setAdvertiseMode(ADVERTISE_MODE)
                            .setConnectable(true)
                            .setTimeout(0)
                            .setTxPowerLevel(ADVERTISE_TX_POWER)
                            .build()

                    btManager.adapter.bluetoothLeAdvertiser.startAdvertising(settings, data, scanData, advertisingCallback)
                }
            }
        }
    }

    private fun isByteAllZeros(bytes: ByteArray): Boolean {
        return bytes.all {
            it.toInt() == 0
        }
    }
}