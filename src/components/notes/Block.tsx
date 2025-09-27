import { BlockData } from '../../data/notes';
import { KeyedArray, WithKey } from '../../data/keys';
import { ControlledComponentProps, NavigationProps } from '../../data/props';
import NoteBlock from './NoteBlock';
import TableBlock from './TableBlock';
import { KeyboardEventHandler } from 'react';
import EmbedBlock from './EmbedBlock';
import MatrixBlock from './MatrixBlock';
import MatMulBlock from './MatMulBlock';

function Block({
    value,
    onChange,
    onReplace,
    onDuplicate,
    onIndent,
    onMoveUp,
    onMoveDown,
    placeholder,
    ...otherProps
}: ControlledComponentProps<WithKey<BlockData>> &
    NavigationProps & {
        onReplace?: (...blocks: KeyedArray<BlockData>) => void;
        onDuplicate?: () => void;
        onIndent?: (change: -1 | 1) => void;
        onMoveUp?: () => void;
        onMoveDown?: () => void;
        placeholder?: string;
    }) {
    const handleKeyDown: KeyboardEventHandler = event => {
        if (event.key === 'Tab') {
            event.preventDefault();
            if (event.shiftKey) {
                if (value.indent <= 0) return;
                onIndent?.(-1);
            } else {
                onIndent?.(1);
            }
        }
        if (event.key == 'ArrowUp' && event.altKey) {
            onMoveUp?.();
        }
        if (event.key == 'ArrowDown' && event.altKey) {
            onMoveDown?.();
        }
        if (event.key == 'Q' && event.ctrlKey && event.shiftKey) {
            onDuplicate?.();
        }
    };


    const blockType = (() => {
        switch (value.type) {
            case 'NOTE':
                return (
                    <NoteBlock
                        value={value}
                        onChange={onChange}
                        onReplace={onReplace}
                        placeholder={placeholder}
                        {...otherProps}
                    />
                );
            case 'TABLE':
                return (
                    <TableBlock
                        value={value}
                        onChange={onChange}
                        {...otherProps}
                    />
                );
            case 'MATRIX':
                return (
                    <MatrixBlock
                        value={value}
                        onChange={onChange}
                        {...otherProps}
                    />
                );
            case 'MATMUL':
                return (
                    <MatMulBlock
                        value={value}
                        onChange={onChange}
                        {...otherProps}
                    />
                )
            case 'EMBED':
                return (
                    <EmbedBlock
                        value={value}
                        onChange={onChange}
                        {...otherProps}
                    />
                );
        }
    })();

    return (
        <div
            className='my-1 flex flex-row items-start'
            onKeyDown={handleKeyDown}
            style={{ marginLeft: `${value.indent * 2}em` }}>
            {blockType}
        </div>
    );
}

export default Block;
