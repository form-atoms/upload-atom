import { act, renderHook } from "@testing-library/react";
import {
  formAtom,
  useFormSubmit,
  useFieldActions,
  useFieldValue,
  useFieldState,
} from "form-atoms";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { uploadAtom } from "./uploadAtom";

import { useProgress, useUpload } from "../hooks";

describe("uploadAtom()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
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

  it("resets with fieldActions", async () => {
    const atom = uploadAtom({
      upload: async (file) => {
        return file.name;
      },
    });

    const { result: upload } = renderHook(() => useUpload(atom));

    await act(() => upload.current.setFile(new File([], "resetAction.jpg")));

    const { result: value } = renderHook(() => useFieldValue(atom));

    const { result: actions } = renderHook(() => useFieldActions(atom));

    await act(() => actions.current.validate());

    expect(value.current).toBe("resetAction.jpg");

    act(() => actions.current.reset());

    expect(value.current).toBeUndefined();
    expect(upload.current.file).toBeUndefined();
  });

  it("produces form field errors", async () => {
    const atom = uploadAtom({
      upload: async () => {
        throw new Error("Upload failed");
      },
      getFieldError: (error) => [
        error instanceof Error ? error.message : "Unknown error",
      ],
    });

    const { result: upload } = renderHook(() => useUpload(atom));
    const { result: actions } = renderHook(() => useFieldActions(atom));

    await act(() => upload.current.setFile(new File([], "error.jpg")));

    await act(() => actions.current.validate());

    const { result: state } = renderHook(() => useFieldState(atom));

    expect(state.current.errors).toEqual(["Upload failed"]);
  });

  it("can signalize upload progress", async () => {
    const atom = uploadAtom({
      upload: async (file, { setProgress }) => {
        return new Promise((resolve) => {
          const total = 100;
          let loaded = 0;
          const interval = setInterval(() => {
            loaded += 10;
            console.log({ progressing: loaded / total });
            setProgress(loaded / total);
            if (loaded >= total) {
              clearInterval(interval);
              resolve(`uploaded:${file.name}`);
            }
          }, 10);
        });
      },
    });

    const { result: upload } = renderHook(() => useUpload(atom));
    const { result: actions } = renderHook(() => useFieldActions(atom));

    await act(() => upload.current.setFile(new File([], "progress.jpg")));
    await act(() => actions.current.validate());

    const { result: progress, rerender } = renderHook(() => useProgress(atom));

    expect(progress.current).toBe(0);

    await act(() => vi.advanceTimersToNextTimer());
    expect(progress.current).toBeGreaterThan(0);

    await act(() => vi.runAllTimers());
    expect(progress.current).toBe(1);
  });
});
