import { fieldAtom } from "form-atoms";
import { type Atom, type WritableAtom, atom } from "jotai";

import { extendAtom } from "./extendAtom";
import { type ExtendFieldAtom } from "./types";

type UploadStatus = "idle" | undefined;

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
    /**
     * A read-only atom containing the promise of the uploaded file's value.
     */
    requestAtom: Atom<Promise<Value> | undefined>;
    /**
     * A write-only atom for resetting the field atoms to their
     * initial states.
     */
    reset: WritableAtom<null, [], void>;
  }
>;

type UploadAtomConfig<Value> = {
  name?: string;
  upload: (
    file: File,
    options: { readonly signal: AbortSignal },
  ) => Promise<Value>;
  getFieldError?(error: unknown): string[];
};

export function uploadAtom<Value>({
  upload,
  getFieldError,
  ...config
}: UploadAtomConfig<Value>): UploadAtom<Value> {
  const fileAtom = atom<File | undefined>(undefined);

  const requestAtom = atom(async (get, options) => {
    const file = get(fileAtom);

    return file && upload(file, options);
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
      } catch (error) {
        return getFieldError?.(error) ?? [];
      }
    },
  });

  // @ts-expect-error field IS primitive atom
  return extendAtom(field, ({ reset }) => ({
    fileAtom,
    requestAtom,
    uploadStatus: atom<UploadStatus>((get) => {
      if (!get(fileAtom)) {
        return "idle";
      }
      return undefined;
    }),
    reset: atom(null, (_, set) => {
      set(reset);
      set(fileAtom, undefined);
    }),
  }));
}
