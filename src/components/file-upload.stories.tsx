import { type FieldAtom, useFieldValue } from "form-atoms";
import { ErrorBoundary } from "react-error-boundary";
import { useEffect, useState } from "react";
import { FileUpload } from "./file-upload";
import { FileInput } from "./file-input";

import { UploadAtom, uploadAtom } from "../atoms";
import { PicoFieldErrors } from "../scenarios/PicoFieldErrors";
import { meta, formStory } from "../scenarios/StoryForm";
import { useUpload } from "../hooks";

export default {
  ...meta,
  title: "components/FileUpload",
};

let id = 1;

const avatar = uploadAtom({
  upload: () =>
    new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`https://picsum.photos/id/${id++}/100/100`);
      }, 2000);
    }),
});

const Image = ({ url }: { url: FieldAtom<string> }) => {
  const value = useFieldValue(url);

  return (
    <img width={100} height={100} style={{ marginRight: 20 }} src={value} />
  );
};

const Preview = ({ atom }: { atom: UploadAtom<string> }) => {
  const { file } = useUpload(atom);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      setSrc(reader.result as string);
    });

    if (file) {
      reader.readAsDataURL(file);
    }
  }, [file]);

  return file && src ? (
    <img width={100} height={100} style={{ marginRight: 20 }} src={src} />
  ) : null;
};

const IdleMessage = ({ atom }: { atom: UploadAtom<string> }) => {
  const { file } = useUpload(atom);

  return file ? "Submit the form to upload the file." : "Please select a file.";
};

export const ImageUpload = formStory({
  parameters: {
    docs: {
      description: {
        story:
          "Here we use custom `uploadAtom()` which handles `File` upload from the client side. The form will eventually be submitted with the uploaded URL.",
      },
    },
  },
  args: {
    fields: { avatar },
    children: ({ fields }) => (
      <div>
        <ErrorBoundary fallback={<p>Failed to upload. Please retry</p>}>
          <FileUpload
            autostart={false}
            atom={fields.avatar}
            fallback={
              <>
                <p>
                  <Preview atom={fields.avatar} />
                  Please wait...
                </p>
                <progress />
              </>
            }
          >
            {({ isSuccess, isIdle }) => (
              <div>
                {isIdle && (
                  <p>
                    <Preview atom={fields.avatar} />
                    <IdleMessage atom={fields.avatar} />
                  </p>
                )}
                {isSuccess && (
                  <p>
                    <Image url={fields.avatar} />
                    <ins>Done. </ins>
                  </p>
                )}
              </div>
            )}
          </FileUpload>
        </ErrorBoundary>
        <FileInput atom={fields.avatar} />
        <PicoFieldErrors field={fields.avatar} />
      </div>
    ),
  },
});
