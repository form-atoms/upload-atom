import { useAtomValue } from "jotai";

import type { UploadAtom } from "../atoms";

export function useProgress<T>(uploadAtom: UploadAtom<T>) {
  const atoms = useAtomValue(uploadAtom);

  return useAtomValue(atoms.progressAtom);
}
