export default function useImageInput() {
  function chooseImage(onLoaded: (imageData: ImageData) => void): void {
    const input = document.createElement("input");
    input.accept = "image/*";
    input.type = "file";
    input.click();

    input.addEventListener("change", async (event) => {
      const files: FileList | null = (event.target as HTMLInputElement).files;
      if (files === null || files.length === 0) {
        return;
      }

      const reader = new FileReader();
      const bytes: Uint8Array = new Uint8Array(await files[0].arrayBuffer());

      reader.addEventListener("load", async () => {
        if (reader.result === null || reader.result instanceof ArrayBuffer) {
          return;
        }

        onLoaded?.({
          data: bytes,
          dataURL: reader.result,
        });
      });

      reader.readAsDataURL(files[0]);
    });
  }

  return chooseImage;
}

export interface ImageData {
  data: Uint8Array;
  dataURL: string;
}
