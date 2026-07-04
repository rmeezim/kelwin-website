// ProtocolSeam — the red strip that stitches dark and light sections
// together. Server component; styles live in SystemFurniture.css.
type ProtocolSeamProps = {
  label: string;
  reading?: string;
};

export default function ProtocolSeam({ label, reading }: ProtocolSeamProps) {
  return (
    <div className="sys-seam" aria-hidden="true">
      <span className="sys-seam-label">{label}</span>
      {reading && <span className="sys-seam-reading">{reading}</span>}
    </div>
  );
}
