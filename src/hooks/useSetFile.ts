import { useCallback } from "react";
import { useAtomCallback } from "jotai/utils";
import { UploadAtom } from "../atoms";

/**
 * Sets the file for a given UploadAtom. Useful in custom file input handling, especially within a <List>.
 * NOTE: there is no reset, this callback is designed to be called once.
 * @returns A callback function to set the file for a given UploadAtom.
 */
export function useSetFile() {
  return useAtomCallback(
    useCallback((get, set, uploadField: UploadAtom<any>, file: File) => {
      set(get(uploadField).fileAtom, file);
    }, []),
  );
}
