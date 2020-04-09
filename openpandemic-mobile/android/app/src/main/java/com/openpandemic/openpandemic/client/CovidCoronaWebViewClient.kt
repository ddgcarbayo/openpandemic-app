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

import android.content.Context
import android.os.Build
import android.webkit.WebView
import android.webkit.WebViewClient
import org.json.JSONArray
import org.json.JSONObject

class CovidCoronaWebViewClient(context: Context) : WebViewClient() {

    companion object {
        const val PREFERENCES_ID = "CoronaPreferences"
        const val USER_PREFERENCES_ID = "UserCoronaPreferences"
        const val MESSAGE_KEY = "contact-list"
        const val CONTACT_ELEMENT = "contact-id"
        const val CONTACTS_ELEMENT = "contacts"
    }

    private val sharedPreferences = context.applicationContext.getSharedPreferences(PREFERENCES_ID, 0)
    private val userSharedPreferences = context.applicationContext.getSharedPreferences(USER_PREFERENCES_ID, 0)

    override fun onPageFinished(view: WebView, url: String) {
        super.onPageFinished(view, url)

        val script = String.format("window.document.documentElement.setAttribute('isAndroid', %s);",
                Build.VERSION.SDK_INT)
        view.evaluateJavascript(script, null)

        prepareData()?.let {
            view.evaluateJavascript("localStorage.setItem('" + MESSAGE_KEY + "', '$it');", null)
            clearPreferences()
        }
    }

    private fun prepareData(): JSONObject? {
        val valueList = sharedPreferences.all.values

        val array = JSONArray()
        valueList.forEach {
            val json = JSONObject(it.toString())
            array.put(json)
        }

        if (valueList.isNotEmpty()) {
            JSONObject().apply {
                put(CONTACT_ELEMENT, userSharedPreferences.getString("id", ""))
                put(CONTACTS_ELEMENT, array)
                return this
            }
        }
        return null
    }

    private fun clearPreferences() {
        val editor = sharedPreferences.edit()
        editor.clear()
        editor.commit()
    }
}