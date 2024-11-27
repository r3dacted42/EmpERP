import { useEffect, useState } from 'react'
import './DatePicker.css';

function DatePicker({ onChange }) {
    const maxYear = new Date().getFullYear();
    const [year, setYear] = useState(maxYear);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [date, setDate] = useState(new Date().getDate());
    const [dateMax, setDateMax] = useState(null);

    function isLeapYear() {
        return (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0);
    }

    function calcDateMax() {
        console.log("recalculating date max at month: " + month);
        let _dateMax = 31;
        if (month == 2) {
            console.log('feb');
            _dateMax = isLeapYear() ? 29 : 28;
        } else if ((month <= 7 && month % 2 === 0)
            || (month >= 7 && month % 2 !== 0)) {
            console.log('not feb');
            _dateMax = 30;
        }
        if (date > _dateMax) setDate(_dateMax);
        setDateMax(_dateMax);
    }

    useEffect(() => {
        calcDateMax();
    }, [year, month])

    useEffect(() => {
        onChange(`${year}-${month}-${date}`);
    }, [year, month, date])

    return (
        <div className='date-picker'>
            <span className="material-icons">today</span>
            <input type='number' value={year} min={1900} max={maxYear} onChange={(e) => setYear(e.target.value)} title='year' required></input>
            /<input type='number' value={month} min={1} max={12} onChange={(e) => setMonth(e.target.value)} title='month' required></input>
            /<input type='number' value={date} min={1} max={dateMax} onChange={(e) => setDate(e.target.value)} title='date' required></input>
        </div>
    )
}

export default DatePicker