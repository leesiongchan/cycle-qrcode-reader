interface QrCode {
  callback(result: string, error: string): void;
  decode(data: string | ImageData): void;
}

interface QrCodeFactory {
  new(): QrCode;
}

declare var qrCode: QrCodeFactory;

declare module "qrcode-reader" {
  export = qrCode;
}
