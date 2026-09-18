import { type FieldAtom, useFieldValue } from "form-atoms";
import { useEffect, useState } from "react";
import { type UploadAtom } from "../atoms";
import { useUpload } from "../hooks";

export function Image({ url }: { url: FieldAtom<string> }) {
  const value = useFieldValue(url);

  return (
    <img width={100} height={100} style={{ marginRight: 20 }} src={value} />
  );
}

export function Preview<T>({ atom }: { atom: UploadAtom<T> }) {
  const { file } = useUpload(atom);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      setSrc(reader.result as string);
    });

    if (file) {
      reader.readAsDataURL(file);
    }
  }, [file]);

  return file && src ? (
    <img width={100} height={100} style={{ marginRight: 20 }} src={src} />
  ) : null;
}

export function IdleMessage<T>({ atom }: { atom: UploadAtom<T> }) {
  const { file } = useUpload(atom);

  return file ? "Submit the form to upload the file." : "Please select a file.";
}
