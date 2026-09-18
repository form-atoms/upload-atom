import { useCallback } from "react";
import { useAtomValue, useSetAtom, useAtom } from "jotai";

import type { UploadAtom } from "../atoms";

export function useUpload<T>(uploadAtom: UploadAtom<T>) {
  const atoms = useAtomValue(uploadAtom);
  const [file, setFileAtom] = useAtom(atoms.fileAtom);
  const reset = useSetAtom(atoms.reset);

  const setFile = useCallback(
    (file: File) => {
      reset();
      setFileAtom(file);
    },
    [reset, setFileAtom],
  );

  return {
    file,
    setFile,
  };
}
