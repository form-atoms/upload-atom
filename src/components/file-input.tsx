import { useCallback } from "react";

import { UploadAtom } from "../atoms";
import { useUpload } from "../hooks/useUpload";

type Props = {
  atom: UploadAtom<any>;
};

export function FileInput({ atom }: Props) {
  const { setFile } = useUpload(atom);

  const handleEvent = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const [file] = event.target.files ?? [];

      if (file) {
        setFile(file);
      }
    },
    [setFile],
  );

  return <input type="file" onChange={handleEvent} />;
}
