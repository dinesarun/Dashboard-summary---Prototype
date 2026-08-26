type Props = {
  series: number[];
  positive?: boolean;
  width?: number;
  height?: number;
  className?: string;
};

export function MiniSparkline({ series, positive = true, width = 96, height = 28, className }: Props) {
  const max = Math.max(...series);
  const min = Math.min(...series);
  const range = Math.max(1, max - min);
  const stepX = width / (series.length - 1);
  const points = series
    .map((v, i) => `${i * stepX},${height - ((v - min) / range) * height}`)
    .join(" ");
  const stroke = positive ? "oklch(0.62 0.18 155)" : "oklch(0.62 0.22 25)";
  const fill = positive ? "oklch(0.62 0.18 155 / 0.12)" : "oklch(0.62 0.22 25 / 0.12)";

  return (
    <svg width={width} height={height} className={className} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        points={`0,${height} ${points} ${width},${height}`}
        fill={fill}
        stroke="none"
      />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth={1.5} />
    </svg>
  );
}
