import type { ReactNode } from "react";
import { useProgress } from "../hooks";
import type { UploadAtom } from "../atoms";

type ProgressFallback = ({ progress }: { progress: number }) => ReactNode;

type Props<Value> = {
  atom: UploadAtom<Value>;
  children: ProgressFallback;
};

export function Progress<Value>({ atom, children }: Props<Value>) {
  return children({ progress: useProgress(atom) });
}
