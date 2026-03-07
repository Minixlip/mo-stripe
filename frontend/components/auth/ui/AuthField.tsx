import type { AuthField as AuthFieldType } from '../types';

type AuthFieldProps = {
  field: AuthFieldType;
};

export function AuthField({ field }: AuthFieldProps) {
  return (
    <label
      htmlFor={field.name}
      className="block"
    >
      <span className="mono-ui text-[11px] uppercase tracking-[0.12em] text-[#0A0A0A]/60">
        {field.label}
      </span>
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        autoComplete={field.autoComplete}
        placeholder={field.placeholder}
        className="mono-ui mt-2 w-full border border-[#0A0A0A] bg-[#FFFFFF]/45 px-4 py-3 text-[14px] tracking-[0.02em] text-[#0A0A0A] outline-none transition-[background-color,box-shadow] duration-150 placeholder:text-[#0A0A0A]/35 focus:bg-[#FFFFFF] focus:shadow-[inset_0_0_0_1px_#0A0A0A]"
      />
      {field.helper ? (
        <span className="mt-2 block text-[13px] leading-5 text-[#0A0A0A]/52">
          {field.helper}
        </span>
      ) : null}
    </label>
  );
}
