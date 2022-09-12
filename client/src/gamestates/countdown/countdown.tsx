import { useEffect, useState } from 'react';
import './countdown.scss';

function CountdownComponent(props: { timeLeft_ms: number; run: boolean }) {

    const [timeLeft_ms, setTimeLeft] = useState<number>(props.timeLeft_ms);

    useEffect(() => {
        setTimeLeft(props.timeLeft_ms);
    }, [props.timeLeft_ms]);

    useEffect(() => {
        if (props.run) {
            const timer = setTimeout(() => setTimeLeft(timeLeft_ms! - 30), 30);
            return () => clearTimeout(timer);
        }
    }, [props.run, timeLeft_ms]);

    let timeLeft_s = '';
    if (timeLeft_ms) {
        const dsLeft = Math.ceil(timeLeft_ms/100) % 10;
        timeLeft_s = Math.floor(timeLeft_ms/1000) + (timeLeft_ms < 30 * 1000 ?  '.' + dsLeft : '');
    }

    return (
        <span>{timeLeft_s}</span>
    );
}

export default CountdownComponent;
