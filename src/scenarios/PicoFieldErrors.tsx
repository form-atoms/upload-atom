import { type FieldAtom, useFieldErrors } from "form-atoms";

const style = { color: "var(--pico-color-red-550)" };

export function PicoFieldErrors(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: { field: FieldAtom<any> },
) {
  const errors = useFieldErrors(props.field);

  return (
    <>
      {errors.map((error, index) => (
        <small key={index} style={style}>
          {error}
        </small>
      ))}
    </>
  );
}
