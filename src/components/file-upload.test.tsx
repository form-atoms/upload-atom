import { describe, it, expect, vi } from "vitest";
import { FileUpload } from "./file-upload";
import { render, renderHook, screen, act } from "@testing-library/react";
import { uploadAtom } from "../atoms";
import { useUpload } from "../hooks";

describe("FileUpload component", () => {
  it("renders idle when there is no file selected", () => {
    const upload = vi.fn(async () => {});
    const atom = uploadAtom({ upload });

    render(
      <FileUpload atom={atom}>
        {({ isIdle }) => (isIdle ? "idle" : null)}
      </FileUpload>,
    );

    expect(screen.getByText("idle")).toBeInTheDocument();
    expect(upload).not.toHaveBeenCalled();
  });

  describe("selecting a file", () => {
    it("does start upload when the autostart prop is true (default)", async () => {
      const upload = vi.fn(async () => {
        return "uploaded";
      });
      const atom = uploadAtom({ upload });

      render(
        <FileUpload autostart atom={atom}>
          {({ isSuccess }) => (isSuccess ? "success" : null)}
        </FileUpload>,
      );

      const { result } = renderHook(() => useUpload(atom));

      await act(async () =>
        result.current.setFile(new File([], "autostart.jpg")),
      );

      expect(upload).toHaveBeenCalled();
      expect(screen.getByText("success")).toBeInTheDocument();
    });

    it("does not start upload when the autostart prop is false", async () => {
      const upload = vi.fn(async () => {});
      const atom = uploadAtom({ upload });

      render(
        <FileUpload autostart={false} atom={atom}>
          {({ isIdle }) => (isIdle ? "idle" : null)}
        </FileUpload>,
      );

      const { result } = renderHook(() => useUpload(atom));

      await act(async () =>
        result.current.setFile(new File([], "autostart-false.jpg")),
      );

      expect(upload).not.toHaveBeenCalled();
      expect(screen.getByText("idle")).toBeInTheDocument();
    });
  });
});
