/**
 * Countdown - Industrial Brutalist
 */

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
    deadline: string;
    className?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
}

function calculateTimeLeft(deadline: string): TimeLeft {
    const now = new Date().getTime();
    const target = new Date(deadline).getTime();
    const diff = target - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        isExpired: false,
    };
}

export function Countdown({ deadline, className = '' }: CountdownProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(deadline));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(deadline));
        }, 1000);

        return () => clearInterval(timer);
    }, [deadline]);

    if (timeLeft.isExpired) {
        return (
            <div className={`flex items-center gap-2 text-zinc-500 mono text-sm ${className}`}>
                <Clock className="w-4 h-4" />
                <span>Ended</span>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Clock className="w-4 h-4 text-zinc-500" />
            <div className="flex gap-1 mono text-sm">
                {timeLeft.days > 0 && (
                    <span className="text-zinc-50">
                        {timeLeft.days}<span className="text-zinc-600">d</span>
                    </span>
                )}
                <span className="text-zinc-50">
                    {timeLeft.hours.toString().padStart(2, '0')}
                    <span className="text-zinc-600">h</span>
                </span>
                <span className="text-zinc-50">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                    <span className="text-zinc-600">m</span>
                </span>
                {timeLeft.days === 0 && (
                    <span className="text-zinc-50">
                        {timeLeft.seconds.toString().padStart(2, '0')}
                        <span className="text-zinc-600">s</span>
                    </span>
                )}
            </div>
        </div>
    );
}
