import { usePropState } from '@tater-archives/react-use-destructure';
import { WithKey } from '../../data/keys';
import { Direction, isBlank, MatMulBlockData } from '../../data/notes';
import { ControlledComponentProps, NavigationProps } from '../../data/props';
import NoteMatrix from './NoteMatrix';
import { useEffect, useState } from 'react';

function MatMulBlock({
    value,
    onChange,
    focused,
    focusSide,
    onFocus,
    onDeleteOut,
    ...props
}: ControlledComponentProps<WithKey<MatMulBlockData>> & NavigationProps) {
    const [first, setFirst] = usePropState(value, onChange, 'first');
    const [second, setSecond] = usePropState(value, onChange, 'second');
    const [result, setResult] = usePropState(value, onChange, 'result');

    const [focusedMatrix, setFocusedMatrix] = useState<[matrix: 'first' | 'second' | 'result', side: Direction | undefined]>(['first', undefined]);

    // Handle Focusing
    useEffect(() => {
        if (focused && focusedMatrix === undefined) {
            if (focusSide === 'top')
                setFocusedMatrix(['second', 'top']);
            else if (focusSide === 'bottom')
                setFocusedMatrix(['first', 'bottom'])
            else
                setFocusedMatrix(['first', undefined])
        }
    }, [focusSide, focused, focusedMatrix]);

    function makeProps(name: 'first' | 'second' | 'result') {
        return {
            focused: focused && focusedMatrix?.[0] === name,
            focusSide: focused && focusedMatrix?.[0] === name ? focusedMatrix?.[1] : undefined,
            onFocus() {
                onFocus()
                setFocusedMatrix([name, undefined])
            },
            onDeleteOut() {
                if (onDeleteOut && isBlank(first) && isBlank(second) && isBlank(result))
                    onDeleteOut()
            },
            ...props
        }
    }

    return <div className='grid grid-cols-[auto_auto] gap-2'>
        <div></div>
        <NoteMatrix 
            value={second}
            onChange={setSecond}
            {...makeProps('second')}
            onDownOut={() => setFocusedMatrix(['result', 'top'])}
        />

        <NoteMatrix 
            value={first} 
            onChange={setFirst}
            {...makeProps('first')}
            onUpOut={() => setFocusedMatrix(['second', 'bottom'])}
            onRightOut={() => setFocusedMatrix(['result', 'left'])}
        />
        <NoteMatrix 
            value={result} 
            onChange={setResult}
            {...makeProps('result')}
            onUpOut={() => setFocusedMatrix(['second', 'bottom'])}
            onLeftOut={() => setFocusedMatrix(['first', 'right'])}
        />
    </div>
}

export default MatMulBlock;
