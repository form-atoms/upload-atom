import { ErrorBoundary } from "react-error-boundary";
import { FileUpload } from "./file-upload";
import { FileInput } from "./file-input";
import { Progress } from "./progress";

import { uploadAtom } from "../atoms";
import { PicoFieldErrors } from "../scenarios/PicoFieldErrors";
import { meta, formStory } from "../scenarios/StoryForm";

import { Image, Preview, IdleMessage } from "../scenarios/components";

export default {
  ...meta,
  title: "components/FileUpload",
};

const withProgress = uploadAtom({
  upload: async (file, { setProgress }) => {
    const xhr = new XMLHttpRequest();

    return new Promise((resolve) => {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = event.loaded / event.total;
          console.log("upload progress:", progress);
          setProgress(progress);
        }
      });

      xhr.addEventListener("loadend", () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(`https://picsum.photos/id/99/100/100`);
        }
      });

      xhr.open("POST", "https://httpbin.org/post", true);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");

      xhr.send(file);
    });
  },
});

export const ProgressFallback = formStory({
  parameters: {
    docs: {
      description: {
        story: "Signalize the upload progress in your upload function:",
      },
    },
  },
  args: {
    fields: { withProgress },
    children: ({ fields }) => (
      <div>
        <ErrorBoundary fallback={<p>Failed to upload. Please retry</p>}>
          <FileUpload
            autostart={false}
            atom={fields.withProgress}
            fallback={
              <Progress atom={fields.withProgress}>
                {({ progress }) => (
                  <>
                    <Preview atom={fields.withProgress} />
                    <p>Please wait...</p>
                    <progress value={progress} max={1} />
                  </>
                )}
              </Progress>
            }
          >
            {({ isSuccess, isIdle }) => (
              <div>
                {isIdle && (
                  <p>
                    <Preview atom={fields.withProgress} />
                    <IdleMessage atom={fields.withProgress} />
                  </p>
                )}
                {isSuccess && (
                  <p>
                    <Preview atom={fields.withProgress} />
                    <ins>Done. </ins>
                  </p>
                )}
              </div>
            )}
          </FileUpload>
        </ErrorBoundary>
        <FileInput atom={fields.withProgress} />
        <PicoFieldErrors field={fields.withProgress} />
      </div>
    ),
  },
});
