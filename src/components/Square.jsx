import React from 'react';
import styles from './Square.module.css';

export default function Square({ value, onClick, highlight }) {
    const classNames = [styles.square];
    if (value === 'X') classNames.push(styles.xStyle);
    else if (value === 'O') classNames.push(styles.oStyle);
    if (highlight) classNames.push(styles.highlight);

    return (
        <button onClick={onClick} className={classNames.join(' ')}>
            {value}
        </button>
    );
}
