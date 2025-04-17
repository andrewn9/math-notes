import { ControlledComponentProps, NavigationProps } from '../../data/props';
import NoteTable from './NoteTable';

function NoteMatrix({
    ...props
}: ControlledComponentProps<string[][]> & NavigationProps) {
    return <div className='flex flex-row'>
        <div className='w-2 border-t border-b border-l border-gray-800 dark:border-gray-300' />
        <NoteTable {...props} spaced />
        <div className='w-2 border-t border-b border-r border-gray-800 dark:border-gray-300' />
    </div>
}

export default NoteMatrix;
