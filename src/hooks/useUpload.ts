import { useCallback } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import type { UploadAtom } from "../atoms";

export const useUpload = (uploadAtom: UploadAtom<unknown>) => {
  const atoms = useAtomValue(uploadAtom);
  const setFileAtom = useSetAtom(atoms.fileAtom);
  const reset = useSetAtom(atoms.reset);

  const setFile = useCallback(
    (file: File) => {
      reset();
      setFileAtom(file);
    },
    [reset, setFileAtom],
  );

  return {
    setFile,
  };
};
