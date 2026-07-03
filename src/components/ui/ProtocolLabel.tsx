import { cn } from "@/lib/utils";

interface ProtocolLabelProps {
  label: string;
  value?: string;
  className?: string;
  valueBronze?: boolean;
}

export default function ProtocolLabel({
  label,
  value,
  className,
  valueBronze = false,
}: ProtocolLabelProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span
        className="text-[10px] tracking-[0.18em] uppercase font-body font-medium"
        style={{ color: "var(--text-faint)" }}
      >
        {label}
      </span>
      {value && (
        <span
          className={cn(
            "text-[11px] tracking-[0.14em] uppercase font-body font-medium",
            valueBronze ? "text-bronze" : ""
          )}
          style={valueBronze ? undefined : { color: "var(--text-muted)" }}
        >
          {value}
        </span>
      )}
    </div>
  );
}
