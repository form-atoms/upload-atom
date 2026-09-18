<div align="center">
  <img width="180" style="margin: 32px" src="./form-atoms-field.svg">
  <h1>@form-atoms/upload-atom</h1>
</div>

The upload extension for form-atoms.

```
npm install @form-atoms/upload-atom
```

<a aria-label="NPM version" href="https://www.npmjs.com/package/%40form-atoms/upload-atom">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/%40form-atoms/upload-atom?style=for-the-badge&labelColor=24292e">
</a>
<a aria-label="Code coverage report" href="https://codecov.io/gh/form-atoms/upload-atom">
  <img alt="Code coverage" src="https://img.shields.io/codecov/c/gh/form-atoms/upload-atom?style=for-the-badge&labelColor=24292e">
</a>

## Features

- 🧩 **formAtom integrated:** Your form submit will wait, while the upload is in progress.
- 🎮 **File Input:** Ready-to-use file input component.
- ▶️ **Manual or Automatic upload:** Start upload on file selection or manually.
- ⚛️ **React 19**: uses the `<Suspense>` to manage the loading state.
- 💥 **ErrorBoundary**: use the [react-error-boundary](https://www.npmjs.com/package/react-error-boundary) to catch upload errors.

### Quick Start

```tsx
import { fromAtom, useForm } from "form-atoms";
import {
  uploadAtom,
  FileInput,
  FileUpload,
  type UploadAtom,
} from "@form-atoms/upload-atom";
import { ErrorBoundary } from "react-error-boundary";

import { fetchUploadUrl, deliveryUrl, postFile } from "@/lib/cloudflare";

// 1. define your upload atom using some file service (here Cloudflare Images)
export const cloudflareUploadAtom = uploadAtom(async (file) => {
  const { id, uploadUrl } = await fetchUploadUrl();

  try {
    await postFile(uploadUrl, file);

    return id;
  } catch {
    // Throw string reason for the failure.
    throw "Failed to upload.";
  }
});

// 2. Use the uploadAtom inside a form as a regular fieldAtom:
const personForm = formAtom({
  profilePic: cloudflareUploadAtom(),
});

// Result to render after successful upload:
const Image = ({ atom }: { atom: UploadAtom<string> }) => {
  const cfId = useFieldValue(url);

  return (
    <img
      width={100}
      height={100}
      style={{ marginRight: 20 }}
      src={deliveryUrl(cfId)}
    />
  );
};

export function Form() {
  const { fieldAtoms, submit } = useForm(personForm);
  const errors = useFieldErrors(fieldAtoms.profilePic);

  return (
    <form onSubmit={submit(console.log)}>
      <ErrorBoundary
        fallback={
          <p>
            Failed to upload. Use the <code>useFieldErrors()</code> hook to
            display the reason thrown from your <code>upload</code> action.
          </p>
        }
      >
        <FileUpload
          atom={fieldAtoms.profilePic}
          fallback={
            <p>
              Please wait... <progress />
            </p>
          }
        >
          {({ isIdle, isSuccess }) => (
            <div>
              {isIdle ? (
                <>Please choose a file.</>
              ) : isSuccess ? (
                <p>
                  <Image atom={fields.profilePic} />
                  <ins>Done. </ins>
                </p>
              ) : (
                <></>
              )}
            </div>
          )}
        </FileUpload>
      </ErrorBoundary>
      <FileInput atom={fieldAtoms.profilePic} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

See [Storybook docs](https://form-atoms.github.io/upload-atom/) for more.
