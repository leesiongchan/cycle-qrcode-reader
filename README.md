# Cycle QR Code Reader

A [Cycle.js](http://cycle.js.org) [Driver](http://cycle.js.org/drivers.html) for [QR Code](https://en.wikipedia.org/wiki/QR_code) scanning in the browser.

It leverages on the media stream captured by the camera and outputs the result repeatedly.

```
$ npm install --save cycle-qrcode-reader
```

## Usage

Basics:

```js
import Cycle from '@cycle/xstream-run';
import { makeQrCodeReaderDriver } from 'cycle-qrcode-reader';

function main(sources) {
  // ...
}

const drivers = {
  QrCodeReader: makeQrCodeReaderDriver(),
}

Cycle.run(main, drivers);
```

Simple and normal use case:

```js
function main({ DOM, QrCodeReader }) {
  return {
    DOM: QrCodeReader
      .map(({ mediaStream, result }) =>
        h('div', [
          h('Result: ', result),
        ]),
        h('video', { props: { autoplay: true, height: 480, srcObject: mediaStream, width: 480 } }),
      ),
    QrCodeReader: DOM
      .select('video')
      .elements()
      .map(videos => videos[0]),
  };
}
```

## API

- [`makeQrCodeReaderDriver`](#makeQrCodeReaderDriver)

### <a id="makeQrCodeReaderDriver"></a> `makeQrCodeReaderDriver()`

**Arguments**

- {HTMLVideoElement} videoEl

**Returns**

- {[MediaStream](https://developer.mozilla.org/en/docs/Web/API/MediaStream)} mediaStream
- {string} result

## Important

It is important to note that **video must consists of both height and width** in order for the driver work properly as the driver is leveraging on the height and width to create a canvas and pass to the QR code reader to decode.
