<p align="left">
  <img width="400" alt="logo" src="./art/ios-header.png"><br><br>
  <h2 align="left">Open Corona App iOS</h2>
</p>

Open Corona App iOS es una aplicación iOS para encapsular la aplicación web e instalarla como una aplicación nativa que ayudará a realizar un seguimiento de los ciudadanos en cuarentena a causa del coronavirus y utilizar las capacidades nativas del teléfono (Bluetooth LE) para poner en contacto a ciudadanos que han dado positivo.

La aplicación puede ser ejecutada en un dispositivo usando Xcode 11 o superior.

## Instalación

1. Despliega la aplicación web en una CDN.

2. Configura esta URL  (y el resto de parámetros del fichero)  en el fichero de configuración de la aplicación de la carpeta utils.

3. Conecta un dispositivo y ejecuta la aplicación desde Xcode.

## Scripts

Este proyecto requiere Swift 5.0 y xcodebuild 11.3 o superior.

Puedes ejecutar las instrucciones de xcodebuild desde la raíz del proyecto:

```
# Archiva la app
xcodebuild archive -project openpandemic.xcodeproj -scheme openpandemic -archivePath openpandemic.xcarchive -configuration Release DEVELOPMENT_TEAM=<Your_Team_id> -quiet

# Exporta la app a .ipa
xcodebuild -archivePath openpandemic.xcarchive -exportPath ./signed -exportArchive -exportOptionsPlist /path/to/your/exportOption.plist -quiet -allowProvisioningUpdates

```
Para mas información acerca de como rellenar el fichero exportOption.plist [consultar aquí](https://developer.apple.com/library/archive/technotes/tn2339/_index.html#//apple_ref/doc/uid/DTS40014588-CH1-WHAT_KEYS_CAN_I_PASS_TO_THE_EXPORTOPTIONSPLIST_FLAG_).

## Exploración de contactos

La aplicación de openpandemic explora el entorno a través de la tecnología Bluetooth LE para intentar poner en contacto a usuarios que han podido estar con ciudadanos positivos.

Cada cierto tiempo (establecido por ```timeInterval```) se analizan los datos obtenidos del entorno en busca de posibles contactos.

Durante ese intervalo se filtra por distancia (```distanceThreshold```) entre dispositivos para obtener los contactos que han estado a una distancia considerada de peligro para un contagio. Esta distancia se calcula a partir del parámetro RSSI recibido de la comunicación con respecto a esta tabla. 

<p align="left">
  <img width="500" alt="logo" src="./art/rssi-meters.png"><br><br>
</p>

Por último, se establece un número mínimo de recepciones (```encounters```) para descartar aquellos contactos que no han estado el tiempo suficiente como para considerarlo un riesgo de contagio.

**Nota:** Para el reconocimiento de dispositivos iOS, se establece una conexión mediante Bluetooth LE al periférico y se le solicita el identificador de dispositivo (```UIDevice.current.identifierForVendor```). Cuando el periférico responde con su identificador este, el dispositivo central lo almacena, teniendo en cuenta el filtrado expuesto anteriormente.
Por otra parte para el reconocimiento de dispositivos Android, se obtiene la información de los datos provenientes de AdvertisementData, donde se aloja el identificador único de dispositivo.

## Configuración de la aplicación

En el fichero de configuración de la aplicación se pueden configurar los parámetros:

- **openpandemicURL** - URL de la CDN de la web.
- **timeInterval** - Tiempo de intervalo de muestreo de dispositivos cercano.
- **encounters** - Número de encuentros que tienen que producirse en el intervalo definido para considerarlo contacto.
- **distanceThreshold** - Distancia que se considera de peligro para detectarlo como un contagio positivo. (Por defecto 2 metros)

## Stack Tecnológico

* [Swift](https://swift.org/). Toda la aplicación esta escrita en Swift.
