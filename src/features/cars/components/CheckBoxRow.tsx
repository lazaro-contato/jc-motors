interface CheckboxRowProps {
  label: string;
  description?: string;
  checked?: boolean;
  onChange: (value: boolean) => void;
}

export function CheckboxRow({
  label,
  description,
  checked = false,
  onChange,
}: CheckboxRowProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-card p-3 transition hover:border-brand-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 rounded border-border accent-brand-500"
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">{label}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
    </label>
  );
}
