declare module "playwright-core/lib/utilsBundle" {
  export const PNG: {
    sync: {
      read(buffer: Buffer): {
        width: number;
        height: number;
        data: Buffer;
      };
    };
  };
}
