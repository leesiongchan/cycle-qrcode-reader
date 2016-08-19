import 'webrtc-adapter';

import QrCode from 'qrcode-reader';
import flattenConcurrently from 'xstream/extra/flattenConcurrently';
import xs, { MemoryStream, Stream } from 'xstream';
import { StreamAdapter } from '@cycle/base';

const qr = new QrCode();

const MEDIA_STREAM_CONSTRAINTS: MediaStreamConstraints = {
  audio: false,
  video: true,
};
const SCAN_INTERVAL = 300;

export interface QrCodeReaderSource {
  mediaStream: MediaStream;
  result: string;
}

function decodeQrCode$(data: ImageData): Stream<string> {
  return xs.create<string>({
    start: listener => {
      qr.decode(data);
      qr.callback = (result, err) => {
        if (err) {
          listener.error(err);
        } else if (result) {
          listener.next(result);
          listener.complete();
        }
      };
    },
    stop: () => {},
  });
}

export function makeQrCodeReaderDriver(): Function {
  const canvas = document.createElement('canvas');
  canvas.style.display = 'none'; // Hide the canvas
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  return function (videoEl$: Stream<HTMLVideoElement>, runStreamAdapter: StreamAdapter): Stream<QrCodeReaderSource> {
    const mediaStream$: Stream<MediaStream> = xs.fromPromise(
      <Promise<MediaStream>> navigator.mediaDevices.getUserMedia(MEDIA_STREAM_CONSTRAINTS)
    );
    const result$: MemoryStream<string> = videoEl$
      .map(videoEl =>
        xs.periodic(SCAN_INTERVAL)
          .map(() => {
            const height = videoEl.height;
            const width = videoEl.width;

            canvas.height = height;
            canvas.width = width;

            ctx.drawImage(videoEl, 0, 0, width, height);

            const imageData = ctx.getImageData(0, 0, width, height);

            return decodeQrCode$(imageData)
              .replaceError(() => xs.empty());
          })
          .compose(flattenConcurrently)
      )
      .flatten()
      .startWith(null);

    return xs.combine(mediaStream$, result$)
      .map(([mediaStream, result]) => ({
        mediaStream,
        result,
      }));
  }
}
