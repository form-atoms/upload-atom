# [2.1.0](https://github.com/form-atoms/upload-atom/compare/v2.0.1...v2.1.0) (2026-09-18)


### Bug Fixes

* **field-error:** define with a config function ([6d5d253](https://github.com/form-atoms/upload-atom/commit/6d5d2533e0e2aa698b40214c5506341549f1e1bc))
* **reset:** enable resetting ([c537d24](https://github.com/form-atoms/upload-atom/commit/c537d24767155a65c65e0635dafdbcc2545d8ee7))


### Features

* **manual-start:** via factory ([d84e391](https://github.com/form-atoms/upload-atom/commit/d84e391387fc9a3ac5a3f5c340ee7a4fa6af04f2))

## [2.0.1](https://github.com/form-atoms/upload-atom/compare/v2.0.0...v2.0.1) (2026-09-17)


### Bug Fixes

* **upload:** pass abort signal ([831748b](https://github.com/form-atoms/upload-atom/commit/831748ba3d79c9add85495f369590522db61f59e))

# [2.0.0](https://github.com/form-atoms/upload-atom/compare/v1.0.3...v2.0.0) (2026-09-17)


### Features

* **file-upload:** use suspense for loading state & error boundary ([09cbe56](https://github.com/form-atoms/upload-atom/commit/09cbe56c5a2826e94906cf12566406891f806f50))


### BREAKING CHANGES

* **file-upload:** requires jotai v3 & react v18

The children no longer provide isLoading nor isError props. Specify your loading UI as the fallback prop.

For the error UI, use the <ErrorBoundary> component to catch the the errors from the Suspense boundary.

# [2.0.0-next.1](https://github.com/form-atoms/upload-atom/compare/v1.0.2...v2.0.0-next.1) (2026-09-17)


### Bug Fixes

* **useUpload:** fix unknown type ([946ef9a](https://github.com/form-atoms/upload-atom/commit/946ef9ab049a66380e248cfcba78a2c6a0ab362d))


### Features

* **file-upload:** use suspense for loading state & error boundary ([3fb373f](https://github.com/form-atoms/upload-atom/commit/3fb373f84081e24acb0b08891fc7c8576817c43f))


### BREAKING CHANGES

* **file-upload:** requires jotai v3 & react v18

The children no longer provide isLoading nor isError props. Specify your loading UI as the fallback prop.

For the error UI, use the <ErrorBoundary> component to catch the the errors from the Suspense boundary.

## [1.0.3](https://github.com/form-atoms/upload-atom/compare/v1.0.2...v1.0.3) (2026-09-17)


### Bug Fixes

* **useUpload:** fix unknown type ([946ef9a](https://github.com/form-atoms/upload-atom/commit/946ef9ab049a66380e248cfcba78a2c6a0ab362d))

## [1.0.2](https://github.com/form-atoms/upload-atom/compare/v1.0.1...v1.0.2) (2026-09-17)


### Bug Fixes

* **hooks:** export the useUpload hook for custom inputs ([955aac1](https://github.com/form-atoms/upload-atom/commit/955aac148c035a37b0fcadfac046eeb2fe1edc01))

## [1.0.1](https://github.com/form-atoms/upload-atom/compare/v1.0.0...v1.0.1) (2026-09-17)


### Bug Fixes

* **build:** ts7 ([42770c0](https://github.com/form-atoms/upload-atom/commit/42770c00352077032c6936bb4ff309ea5097f2e9))
* **build:** use tsdown ([a156b46](https://github.com/form-atoms/upload-atom/commit/a156b4650f5484632ddc77b0567c592bb9689354))

# 1.0.0 (2025-10-22)


### Bug Fixes

* missing tokens ([14e80b4](https://github.com/form-atoms/upload-atom/commit/14e80b434ae7c4373ea5deccec7e91c9c8e2baa7))
* **release:** with OIDC ([5cc6c05](https://github.com/form-atoms/upload-atom/commit/5cc6c050e53da16f47a2c9e7031e50101c715950))
