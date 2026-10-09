// components/ui/ProgressBar.tsx
'use client';

interface Props {
    value: number;       // 0-100
    label?: string;
    colorClass?: string;
    showPercent?: boolean;
    height?: string;
}

export default function ProgressBar({
    value,
    label,
    colorClass = 'bg-gradient-to-r from-purple-500 to-purple-700',
    showPercent = true,
    height = 'h-3',
}: Props) {
    const clamped = Math.min(100, Math.max(0, Math.round(value)));

    return (
        <div className="w-full">
            {(label || showPercent) && (
                <div className="flex justify-between items-center mb-1">
                    {label && <span className="text-sm font-bold text-gray-600">{label}</span>}
                    {showPercent && <span className="text-sm font-bold text-purple-600">{clamped}%</span>}
                </div>
            )}
            <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${height}`}>
                <div
                    className={`${height} rounded-full progress-bar-fill ${colorClass}`}
                    style={{ width: `${clamped}%` }}
                />
            </div>
        </div>
    );
}
