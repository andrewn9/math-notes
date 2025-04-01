import { KeyedArray, addKey } from './keys';

interface TextSegmentData {
    type: 'TEXT';
    content: string;
}
function TextSegmentData(content: string): TextSegmentData {
    return { type: 'TEXT', content };
}

interface MathSegmentData {
    type: 'MATH';
    content: string;
}
function MathSegmentData(content: string): MathSegmentData {
    return { type: 'MATH', content };
}

type Segment = TextSegmentData | MathSegmentData;

interface NoteBlockData {
    type: 'NOTE';
    content: KeyedArray<Segment>;
    indent: number;
    isAnswer: boolean;
}
function NoteBlockData(
    content: string | KeyedArray<Segment>,
    indent = 0,
    isAnswer = false
): NoteBlockData {
    return {
        type: 'NOTE',
        content:
            typeof content === 'string'
                ? [addKey(TextSegmentData(content))]
                : content,
        indent,
        isAnswer,
    };
}

interface AbstractTableBlockData {
    cells: string[][];
    indent: number;
}

interface TableBlockData extends AbstractTableBlockData {
    type: 'TABLE';
}
function TableBlockData(cells: string[][] = [['', ''], ['', '']], indent = 0): TableBlockData {
    return {
        type: 'TABLE',
        cells,
        indent,
    };
}

interface EmbedBlockData {
    type: 'EMBED';
    url: string;
    indent: number;
}
function EmbedBlockData(url: string, indent = 0): EmbedBlockData {
    return { type: 'EMBED', url, indent };
}

interface MatrixBlockData extends AbstractTableBlockData {
    type: 'MATRIX';
}
function MatrixBlockData(cells: string[][] = [['', ''], ['', '']], indent = 0): MatrixBlockData {
    return {
        type: 'MATRIX',
        cells,
        indent,
    };
}

type BlockData = NoteBlockData | TableBlockData | EmbedBlockData | MatrixBlockData;

type Direction = 'left' | 'right' | 'top' | 'bottom';

export {
    TextSegmentData,
    MathSegmentData,
    NoteBlockData,
    TableBlockData,
    EmbedBlockData,
    MatrixBlockData,
};
export type { Segment, BlockData, Direction, AbstractTableBlockData };
