import { usePropState } from '@tater-archives/react-use-destructure';
import { WithKey } from '../../data/keys';
import { TableBlockData } from '../../data/notes';
import { ControlledComponentProps, NavigationProps } from '../../data/props';
import NoteTable from './NoteTable';

function TableBlock({
    value,
    onChange,
    ...props
}: ControlledComponentProps<WithKey<TableBlockData>> & NavigationProps) {
    const [cells, setCells] = usePropState(value, onChange, 'cells');

    return <NoteTable value={cells} onChange={setCells} {...props} headerButtons border />
}

export default TableBlock;
