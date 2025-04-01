import { WithKey } from '../../data/keys';
import { TableBlockData } from '../../data/notes';
import { ControlledComponentProps, NavigationProps } from '../../data/props';
import NoteTable from './NoteTable';

function TableBlock({
    ...props
}: ControlledComponentProps<WithKey<TableBlockData>> & NavigationProps) {
    return <NoteTable {...props} headerButtons border />
}

export default TableBlock;
