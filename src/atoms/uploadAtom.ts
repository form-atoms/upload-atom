import { fieldAtom } from "form-atoms";
import { type Atom, type WritableAtom, atom } from "jotai";

import { extendAtom } from "./extendAtom";
import { type ExtendFieldAtom } from "./types";

type UploadStatus = "idle" | undefined;

export type UploadAtom<Value> = ExtendFieldAtom<
  Value,
  {
    /**
     * A write atom to set the file to be uploaded.
     */
    fileAtom: WritableAtom<File | undefined, [File | undefined], void>;
    /**
     * The upload progress which you set with the `setProgress` function during the upload.
     */
    progressAtom: Atom<number>;
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
    /**
     * A write-only atom for creating the upload promise.
     */
    startAtom: WritableAtom<null, [], void>;
  }
>;

type Options = { readonly signal: AbortSignal };

type UploadAtomConfig<Value> = {
  name?: string;
  upload: (
    file: File,
    options: Options & { setProgress(progress: number): void },
  ) => Promise<Value>;
  getFieldError?(error: unknown): string[];
};

export function uploadAtom<Value>({
  upload,
  getFieldError,
  ...config
}: UploadAtomConfig<Value>): UploadAtom<Value> {
  const fileAtom = atom<File | undefined>(undefined);
  const factoryAtom = atom<((options: Options) => Promise<Value>) | undefined>(
    undefined,
  );
  const progressAtom = atom(0);
  const startAtom = atom(null, (get, set) => {
    const file = get(fileAtom);
    if (file) {
      function factory(options: Options) {
        return upload(file!, {
          ...options,
          setProgress: (progress: number) => set(progressAtom, progress),
        });
      }

      set(progressAtom, 0);
      set(factoryAtom, () => factory);
    }
  });

  const requestAtom = atom(async (get, options) => {
    const factory = get(factoryAtom);
    return factory?.(options);
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
        // start the upload when the form is submitted
        if (!get(factoryAtom)) {
          set(startAtom);
        }

        const result = await get(requestAtom);

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
    progressAtom,
    requestAtom,
    startAtom,
    uploadStatus: atom<UploadStatus>((get) => {
      if (!get(factoryAtom)) {
        return "idle";
      }
      return undefined;
    }),
    reset: atom(null, (_, set) => {
      set(reset);
      set(fileAtom, undefined);
      set(factoryAtom, undefined);
      set(progressAtom, 0);
    }),
  }));
}
