import { ErrorBoundary } from "react-error-boundary";
import { FileUpload } from "./file-upload";
import { FileInput } from "./file-input";

import { uploadAtom } from "../atoms";
import { PicoFieldErrors } from "../storybook/PicoFieldErrors";
import { meta, formStory } from "../storybook/StoryForm";

import { Preview, IdleMessage } from "../storybook/components";

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
    children: ({ fields, autostart }) => (
      <div>
        <ErrorBoundary fallback={<p>Failed to upload. Please retry</p>}>
          <FileUpload
            autostart={autostart}
            atom={fields.avatar}
            fallback={
              <article>
                <Preview atom={fields.avatar} />
                <span aria-busy="true">Uploading your file...</span>
              </article>
            }
          >
            {({ isSuccess, isIdle }) => (
              <div>
                {isIdle && (
                  <article>
                    <Preview atom={fields.avatar} />
                    <IdleMessage atom={fields.avatar} />
                  </article>
                )}
                {isSuccess && (
                  <article>
                    <Preview atom={fields.avatar} />
                    <ins>Done.</ins>
                  </article>
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
