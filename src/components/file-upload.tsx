import { Atom, useAtomValue, useSetAtom } from "jotai";
import { Suspense, useEffect, type ReactNode } from "react";

import { UploadAtom } from "../atoms";

type ChildrenProps<Value> =
  | {
      data: null;
      isSuccess: false;
      isIdle: true;
    }
  | {
      data: Value;
      isSuccess: true;
      isIdle: false;
    };

type Props<Value> = {
  /**
   * Whether to automatically start the upload when a file is selected.
   */
  autostart?: boolean;
  /**
   * The uploadAtom()
   */
  atom: UploadAtom<Value>;
  /**
   * Render either the idle state or the success state with the upload result.
   */
  children: (props: ChildrenProps<Value>) => ReactNode;
  /**
   * Suspense fallback to display while the upload is pending.
   */
  fallback?: ReactNode;
};

export function FileUpload<Value>({
  autostart = true,
  atom,
  children,
  fallback,
}: Props<Value>) {
  const atoms = useAtomValue(atom);
  const status = useAtomValue(atoms.uploadStatus);
  const file = useAtomValue(atoms.fileAtom);
  const start = useSetAtom(atoms.startAtom);

  useEffect(() => {
    if (file && autostart) {
      start();
    }
  }, [file, autostart, start]);

  return status === "idle" ? (
    children({
      data: null,
      isSuccess: false,
      isIdle: true,
    })
  ) : (
    <Suspense fallback={fallback}>
      <Success
        requestAtom={atoms.requestAtom as Atom<Promise<Value>>}
        children={children}
      />
    </Suspense>
  );
}

function Success<Value>({
  requestAtom,
  children,
}: {
  requestAtom: Atom<Promise<Value>>;
} & Pick<Props<Value>, "children">) {
  return children({
    data: useAtomValue(requestAtom),
    isSuccess: true,
    isIdle: false,
  });
}
