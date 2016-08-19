declare class QrCode {
  callback: Function;
  decode: Function;
}

declare module "qrcode-reader" {
  export default QrCode;
}
