import { startTransition, useCallback } from "react";
import { useAtomValue, useSetAtom, useAtom } from "jotai";

import type { UploadAtom } from "../atoms";

export function useUpload<T>(uploadAtom: UploadAtom<T>) {
  const atoms = useAtomValue(uploadAtom);
  const [file, setFileAtom] = useAtom(atoms.fileAtom);
  const reset = useSetAtom(atoms.reset);
  const validate = useSetAtom(atoms.validate);

  const setFile = useCallback(
    (file: File) => {
      reset();
      setFileAtom(file);
      // validation is non-urgent, so keep the file input responsive
      startTransition(() => validate("change"));
    },
    [reset, setFileAtom, validate],
  );

  return {
    file,
    setFile,
  };
}
