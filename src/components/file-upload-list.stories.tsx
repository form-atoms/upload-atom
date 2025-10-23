import { useAtomCallback } from "jotai/utils";
import { useCallback } from "react";
import { type FieldAtom, useFieldValue } from "form-atoms";
import { type ListItem, listAtom } from "@form-atoms/list-atom";

import { FileUpload } from "./file-upload";
import { uploadAtom } from "../atoms";
import { PicoFieldErrors } from "../scenarios/PicoFieldErrors";

import { createListStory, render } from "../scenarios/createListStory";

export default {
  title: "components/FileUpload",
  render,
};

let id = 1;

const fileList = listAtom({
  fields: () => ({
    url: uploadAtom({
      upload: () =>
        new Promise<string>((resolve, reject) => {
          setTimeout(() => {
            console.log(id % 2, id);
            if (id % 2) {
              resolve(`https://picsum.photos/id/${id}/100/100`);
            } else {
              reject("Simulated error message as passed to Promise.reject().");
            }
            id++;
          }, 2000);
        }),
    }),
  }),
});

const Image = ({ url }: { url: FieldAtom<string> }) => {
  const value = useFieldValue(url);

  return (
    <img width={100} height={100} style={{ marginRight: 20 }} src={value} />
  );
};

export const FileUploadList = createListStory({
  parameters: {
    docs: {
      description: {
        story:
          "Here we use custom `uploadAtom()` which handles `File` upload from the client side. The form will eventually be submitted with the uploaded URL.",
      },
    },
  },
  args: {
    atom: fileList,
    children: ({ List }) => (
      <List>
        <List.Item>
          {({ fields, remove }) => {
            return (
              <div
                style={{
                  display: "grid",
                  gridGap: 16,
                  gridTemplateColumns: "auto min-content",
                }}
              >
                <FileUpload atom={fields.url}>
                  {({ isLoading, isSuccess, isError }) => (
                    <div>
                      {isLoading ? (
                        <p>
                          Please wait... <progress />
                        </p>
                      ) : isSuccess ? (
                        <p>
                          <Image url={fields.url} />
                          <ins>Done. </ins>
                        </p>
                      ) : isError ? (
                        <>
                          <p>
                            Failed to upload. Use the <code>FieldErrors</code>{" "}
                            component to display the reason thrown from your{" "}
                            <code>upload</code> action:
                          </p>
                          <PicoFieldErrors field={fields.url} />
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                </FileUpload>
                <div>
                  <button
                    type="button"
                    className="outline secondary"
                    onClick={remove}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          }}
        </List.Item>
        <List.Add>
          {({ add }) => {
            const setFileAtom = useAtomCallback(
              useCallback(
                (get, set, listItem: ListItem<typeof fileList>, file: File) => {
                  const fields = get(get(listItem).fields);
                  const uploadAtom = get(fields.url);

                  set(uploadAtom.fileAtom, file);
                },
                [],
              ),
            );

            return (
              <input
                type="file"
                multiple
                onChange={(event) => {
                  const files = Array.from(event.currentTarget.files ?? []);

                  files.forEach((file) => {
                    const itemForm = add({
                      url: "",
                    });

                    setFileAtom(itemForm, file);
                  });
                }}
              />
            );
          }}
        </List.Add>
      </List>
    ),
  },
});
