import { KeyboardEventHandler, useEffect, useState } from 'react';
import { Direction } from '../../data/notes';
import { ControlledComponentProps, NavigationProps } from '../../data/props';
import { ArrayMap } from '@tater-archives/react-array-utils';
import MathInput from './MathInput';
import { AddIcon, RemoveIcon } from '../../icons';

// This code is going to be absolutely horrible to debug later
function NoteTable({
    value,
    onChange,
    focused,
    focusSide,
    onFocus,
    onDownOut,
    onUpOut,
    onLeftOut,
    onRightOut,
    onDeleteOut,
    onInsertAfter,
    headerButtons = false,
    border = false,
    spaced = false,
}: ControlledComponentProps<string[][]> & NavigationProps & { headerButtons?: boolean, border?: boolean, spaced?: boolean }) {
    const [focusedRow, setFocusedRow] = useState<number>(0);
    const [focusedColumn, setFocusedColumn] = useState<number>(0);
    const [focusedDirection, setFocusedDirection] = useState<
        Direction | undefined
    >();

    // Handle focusing
    useEffect(() => {
        if (focused) {
            if (focusSide === 'bottom') setFocusedRow(value.length - 1);
            if (focusSide === 'top') setFocusedRow(0);
        }
    }, [focusSide, focused, value.length]);

    const handleKeyDown: KeyboardEventHandler = event => {
        if (!event.ctrlKey) return

        if (onInsertAfter && event.key === 'Enter') {
            onInsertAfter()
            event.preventDefault()
        }
        if (onRightOut && event.key === 'ArrowRight') {
            onRightOut()
            event.preventDefault()
        }
        if (onLeftOut && event.key === 'ArrowLeft') {
            onLeftOut()
            event.preventDefault()
        }
        if (onUpOut && event.key === 'ArrowUp') {
            onUpOut()
            event.preventDefault()
        }
        if (onDownOut && event.key === 'ArrowDown') {
            onDownOut()
            event.preventDefault()
        }
    }

    const addColumn = () => {
        onChange(value.map(row => [...row, '']));
    };

    const removeColumn = () => {
        onChange(value.map(row => row.slice(0, -1)));
    };

    return (
        <table className={spaced ? 'border-spacing-x-2 border-spacing-y-1 border-separate' : ''} onKeyDownCapture={handleKeyDown}>
            {headerButtons && <thead>
                <tr>
                    {value[0].slice(0, -1).map((_, i) => (
                        <th key={i}></th>
                    ))}
                    <th>
                        {value[0].length > 1 && (
                            <button
                                className='button float-right rounded-md p-1'
                                onClick={removeColumn}>
                                <RemoveIcon className='icon h-4 w-4' />
                            </button>
                        )}
                    </th>
                    <th>
                        <button
                            className='button rounded-md p-1'
                            onClick={addColumn}>
                            <AddIcon className='icon h-4 w-4' />
                        </button>
                    </th>
                </tr>
            </thead>}
            <tbody>
                <ArrayMap array={value} setArray={onChange}>
                    {(row, { set: setRow, insertAfter, remove }, rowIndex) => (
                        <tr>
                            <ArrayMap array={row} setArray={setRow}>
                                {(cell, { set }, columnIndex) => {
                                    const cellFocused =
                                        focused &&
                                        focusedRow === rowIndex &&
                                        focusedColumn === columnIndex;

                                    const focusUp = () => {
                                        setFocusedRow(rowIndex - 1);
                                        setFocusedDirection('bottom');
                                    };
                                    const focusDown = () => {
                                        setFocusedRow(rowIndex + 1);
                                        setFocusedDirection('top');
                                    };
                                    const focusLeft = () => {
                                        setFocusedColumn(columnIndex - 1);
                                        setFocusedDirection('right');
                                    };
                                    const focusRight = () => {
                                        setFocusedColumn(columnIndex + 1);
                                        setFocusedDirection('left');
                                    };

                                    const navigationHandlers = {
                                        onUpOut() {
                                            if (onUpOut && rowIndex <= 0) {
                                                onUpOut();
                                                return;
                                            }
                                            focusUp();
                                        },
                                        onDownOut() {
                                            if (
                                                onDownOut &&
                                                rowIndex >= value.length - 1
                                            ) {
                                                onDownOut();
                                                return;
                                            }
                                            focusDown();
                                        },
                                        onLeftOut() {
                                            if (focusedColumn <= 0) {
                                                onLeftOut?.();
                                                return;
                                            }
                                            focusLeft();
                                        },
                                        onRightOut() {
                                            if (columnIndex >= row.length - 1) {
                                                addColumn();
                                            }
                                            focusRight();
                                        },
                                        onDeleteOut() {
                                            if (columnIndex === 0) {
                                                if (row.every(e => e === '')) {
                                                    if (
                                                        onDeleteOut &&
                                                        value.length === 1
                                                    ) {
                                                        onDeleteOut();
                                                        return;
                                                    }
                                                    remove();
                                                    // Go to start of previous row
                                                    setFocusedColumn(
                                                        row.length - 1
                                                    );
                                                    setFocusedRow(rowIndex - 1);
                                                    setFocusedDirection(
                                                        'right'
                                                    );
                                                    return;
                                                }
                                            } else if (
                                                value.every(
                                                    e => e[columnIndex] === ''
                                                )
                                            ) {
                                                onChange(
                                                    value.map(e =>
                                                        e.filter(
                                                            (_, i) =>
                                                                i !==
                                                                columnIndex
                                                        )
                                                    )
                                                );
                                            }
                                            focusLeft();
                                        },
                                        onInsertAfter() {
                                            insertAfter(row.map(() => ''));
                                            focusDown();
                                            setFocusedColumn(0);
                                        },
                                    };

                                    return (
                                        <td className={`${border ? 'border border-solid border-gray-400' : ''} p-0 text-center focus-within:bg-black/10 dark:focus-within:bg-white/10`}>
                                            <MathInput
                                                value={cell}
                                                onChange={set}
                                                focused={cellFocused}
                                                focusSide={
                                                    cellFocused
                                                        ? focusedDirection
                                                        : undefined
                                                }
                                                onFocus={() => {
                                                    onFocus();
                                                    setFocusedColumn(
                                                        columnIndex
                                                    );
                                                    setFocusedRow(rowIndex);
                                                }}
                                                {...navigationHandlers}
                                            />
                                        </td>
                                    );
                                }}
                            </ArrayMap>
                        </tr>
                    )}
                </ArrayMap>
            </tbody>
        </table>
    );
}

export default NoteTable;
