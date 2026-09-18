import { describe, it, expect, vi } from "vitest";
import { FileUpload } from "./file-upload";
import { render, renderHook, screen, act } from "@testing-library/react";
import { uploadAtom } from "../atoms";
import { useUpload } from "../hooks";
import { ErrorBoundary, getErrorMessage } from "react-error-boundary";

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
          {({ isSuccess, data }) => (isSuccess ? data : null)}
        </FileUpload>,
      );

      const { result } = renderHook(() => useUpload(atom));

      await act(async () =>
        result.current.setFile(new File([], "autostart.jpg")),
      );

      expect(upload).toHaveBeenCalled();
      expect(screen.getByText("uploaded")).toBeInTheDocument();
    });

    it.skip("does not start upload when the autostart prop is false", async () => {
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

  describe("fallback", () => {
    it("renders the fallback while uploading", async () => {
      const upload = vi.fn(async function hang() {
        return new Promise(() => {});
      });
      const atom = uploadAtom({ upload });

      render(
        <FileUpload atom={atom} fallback="loading">
          {() => null}
        </FileUpload>,
      );

      const { result } = renderHook(() => useUpload(atom));

      await act(async () =>
        result.current.setFile(new File([], "fallback.jpg")),
      );

      expect(screen.getByText("loading")).toBeInTheDocument();
    });
  });

  describe("error", () => {
    it("catches error in the boundary", async () => {
      const upload = vi.fn(async function () {
        throw new Error("disconnected");
      });
      const atom = uploadAtom({ upload });

      render(
        <ErrorBoundary
          fallbackRender={({ error }) => <div>{getErrorMessage(error)}</div>}
        >
          <FileUpload atom={atom}>{() => null}</FileUpload>
        </ErrorBoundary>,
      );

      const { result } = renderHook(() => useUpload(atom));

      await act(async () =>
        result.current.setFile(new File([], "error-boundary.jpg")),
      );

      expect(screen.getByText("disconnected")).toBeInTheDocument();
    });
  });
});
