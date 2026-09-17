import { type FieldAtom, useFieldValue } from "form-atoms";
import { ErrorBoundary } from "react-error-boundary";

import { FileUpload } from "./file-upload";
import { FileInput } from "./file-input";

import { uploadAtom } from "../atoms";
import { PicoFieldErrors } from "../scenarios/PicoFieldErrors";
import { meta, formStory } from "../scenarios/StoryForm";

export default {
  ...meta,
  title: "components/FileUpload",
};

let id = 1;

const profilePic = uploadAtom({
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
    fields: { profilePic },
    children: ({ fields }) => (
      <div>
        <ErrorBoundary fallback={<p>Failed to upload. Please retry</p>}>
          <FileUpload
            autostart={false}
            atom={fields.profilePic}
            fallback={
              <>
                <p>Please wait...</p>
                <progress />
              </>
            }
          >
            {({ isSuccess }) => (
              <div>
                {isSuccess && (
                  <p>
                    <Image url={fields.profilePic} />
                    <ins>Done. </ins>
                  </p>
                )}
              </div>
            )}
          </FileUpload>
        </ErrorBoundary>
        <FileInput atom={fields.profilePic} />
        <PicoFieldErrors field={fields.profilePic} />
      </div>
    ),
  },
});
