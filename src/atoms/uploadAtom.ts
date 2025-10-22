import { fieldAtom } from "form-atoms";
import { type Atom, type WritableAtom, atom } from "jotai";

import { extendAtom } from "./extendAtom";
import { type ExtendFieldAtom } from "./types";

type UploadStatus = "idle" | "loading" | "error" | "success";

export type UploadAtom<Value> = ExtendFieldAtom<
  Value,
  {
    /**
     * An atom to set the file to be uploaded.
     */
    fileAtom: WritableAtom<File | undefined, [File | undefined], void>;
    /**
     * A read-only atom containing the field's upload status.
     */
    uploadStatus: Atom<UploadStatus>;
  }
>;

type UploadAtomConfig<Value> = {
  name?: string;
  upload: (file: File) => Promise<Value>;
};

export function uploadAtom<Value>({
  upload,
  ...config
}: UploadAtomConfig<Value>): UploadAtom<Value> {
  const fileAtom = atom<File | undefined>(undefined);
  const requestAtom = atom(async (get) => {
    const file = get(fileAtom);

    return file && upload(file);
  });

  const field = fieldAtom<Value | undefined>({
    ...config,
    value: undefined,
    validate: async ({ get, set, value }) => {
      if (value) {
        // the file was already uploaded, the value is the response
        return [];
      }

      try {
        const result = await get(requestAtom);

        if (!result) {
          return; // skip validation
        }

        set(get(field).value, result);

        return [];
      } catch (err) {
        if (typeof err !== "string") {
          console.warn(
            "uploadAtom: The error thrown from failed upload is not a string.",
          );
          return ["Failed to upload!"];
        } else {
          return [err];
        }
      }
    },
  });

  // @ts-expect-error field IS primitive atom
  return extendAtom(field, ({ validateStatus }) => ({
    fileAtom,
    uploadStatus: atom<UploadStatus>((get) => {
      const status = get(validateStatus);

      if (status === "validating") {
        return "loading";
      } else if (status === "valid") {
        // initialy, the field is valid, so we need to switch between idle and success
        if (!get(fileAtom) || get(get(field).value) === undefined) {
          return "idle";
        }

        return "success";
      } else {
        return "error";
      }
    }),
  }));
}
