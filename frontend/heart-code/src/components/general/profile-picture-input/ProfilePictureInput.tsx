import "./ProfilePictureInput.css";

interface Props {
  value?: ImageData;
  onChange?: (imageData: ImageData) => void;
  initialValueURL?: string;
}

export default function ProfilePictureInput({
  value,
  onChange,
  initialValueURL,
}: Props) {
  const imageURL = value?.dataURL ?? initialValueURL;
  return (
    <div className="profile-picture-input" onClick={chooseImage}>
      {imageURL != undefined ? (
        <img src={imageURL} className="profile-picture-display" />
      ) : (
        <>
          Click here
          <br />
          to select a
          <br />
          profile picture
          <br />
          <span className="profile-picture-error-display">
            Profile picture is required
          </span>
        </>
      )}
    </div>
  );

  function chooseImage(): void {
    if (onChange === null) {
      console.error("onChange is undefined");
      return;
    }

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

        onChange?.({
          data: bytes,
          dataURL: reader.result,
        });
      });

      reader.readAsDataURL(files[0]);
    });
  }
}

export interface ImageData {
  data: Uint8Array;
  dataURL: string;
}
