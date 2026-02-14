/**
 * Progress Component - Industrial Brutalist
 */

interface ProgressProps {
    value: number; // 0-100
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    className?: string;
}

const sizes = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2.5',
};

export function Progress({ value, size = 'md', showLabel = false, className = '' }: ProgressProps) {
    const clampedValue = Math.min(Math.max(value, 0), 100);

    return (
        <div className={className}>
            <div className={`progress-bar ${sizes[size]}`}>
                <div
                    className="progress-fill"
                    style={{ width: `${clampedValue}%` }}
                />
            </div>
            {showLabel && (
                <div className="mt-1.5 mono text-xs text-zinc-500 text-right">
                    {clampedValue.toFixed(0)}%
                </div>
            )}
        </div>
    );
}
