import { act, renderHook } from "@testing-library/react";
import { formAtom, useFormSubmit } from "form-atoms";
import { describe, expect, it, vi } from "vitest";

import { uploadAtom } from "./uploadAtom";

import { useUpload } from "../hooks/useUpload";

vi.useFakeTimers();

describe("uploadAtom()", () => {
  it("can be submitted within formAtom", async () => {
    const picture = uploadAtom({
      upload: async (file) => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(`uploaded:${file.name}`), 100);
        });
      },
    });

    const form = formAtom({ picture });

    const { result: submit } = renderHook(() => useFormSubmit(form));
    const { result: upload } = renderHook(() => useUpload(picture));

    await act(async () => upload.current.setFile(new File([], "selfie.jpg")));

    const onSubmit = vi.fn();

    await act(async () => submit.current(onSubmit)());

    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    expect(onSubmit).toHaveBeenCalledWith({ picture: "uploaded:selfie.jpg" });
  });
});
