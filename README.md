<div align="center">
  <img width="180" style="margin: 32px" src="./form-atoms-field.svg">
  <h1>@form-atoms/upload-atom</h1>
</div>

The upload extension for form-atoms.

```
npm install @form-atoms/upload-atom
```

<a aria-label="Minzipped size" href="https://bundlephobia.com/result?p=%40form-atoms/upload-atom">
  <img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/%40form-atoms/upload-atom?style=for-the-badge&labelColor=24292e">
</a>
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

### Quick Start

```tsx
import { fromAtom, useForm, useFieldErrors } from "form-atoms";
import { uploadAtom, FileInput, FileUpload } from "@form-atoms/upload-atom";

import { fetchDirectUploadUrl, postFile } from "@/cloudflare";

// 1. define your upload atom using some file service (here Cloudflare Images)
export const cloudflareUploadAtom = uploadAtom(async (file) => {
  const { id, uploadUrl } = await fetchDirectUploadUrl();

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
const Image = ({ url }: { url: FieldAtom<string> }) => {
  const value = useFieldValue(url);

  return (
    <img width={100} height={100} style={{ marginRight: 20 }} src={value} />
  );
};

export const Form = () => {
  const { fieldAtoms, submit } = useForm(personForm);
  const { validateStatus } = useFormStatus(form);
  const errors = useFieldErrors(fieldAtoms.profilePic);

  return (
    <form onSubmit={submit(console.log)}>
      <FileUpload atom={fieldAtoms.profilePic}>
        {({ isIdle, isLoading, isSuccess, isError }) => (
          <div>
            {isIdle ? (
              <>Please choose a file.</>
            ) : isLoading ? (
              <p>
                Please wait... <progress />
              </p>
            ) : isSuccess ? (
              <p>
                <Image url={fields.profilePic} />
                <ins>Done. </ins>
              </p>
            ) : isError ? (
              <>
                <p>
                  Failed to upload. Use the <code>useFieldErrors()</code> hook
                  to display the reason thrown from your <code>upload</code>{" "}
                  action:
                </p>
              </>
            ) : (
              <></>
            )}
          </div>
        )}
      </FileUpload>
      <FileInput atom={fieldAtoms.profilePic} />
      {errors.map((error, index) => (
        <small key={index}>{error}</small>
      ))}
      <button type="submit" disabled={validateStatus === "validating"}>
        {validateStatus === "validating" ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};
```

See [Storybook docs](https://form-atoms.github.io/upload-atom/) for more.
