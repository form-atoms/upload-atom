import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

import { UploadAtom } from "../atoms";

type ChildrenProps = {
  isIdle: boolean;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
};

type Props<Value> = {
  autostart?: boolean;
  atom: UploadAtom<Value>;
  children: (props: ChildrenProps) => React.ReactElement;
};

export function FileUpload<Value>({
  autostart = true,
  atom,
  children,
}: Props<Value>) {
  const atoms = useAtomValue(atom);
  const status = useAtomValue(atoms.uploadStatus);
  const file = useAtomValue(atoms.fileAtom);
  const validate = useSetAtom(atoms.validate);

  useEffect(() => {
    if (file && autostart) {
      validate();
    }
  }, [file, autostart, validate]);

  return children({
    isIdle: status === "idle",
    isLoading: status === "loading",
    isError: status === "error",
    isSuccess: status === "success",
  });
}
