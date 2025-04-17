import { usePropState } from '@tater-archives/react-use-destructure';
import { WithKey } from '../../data/keys';
import { MatrixBlockData } from '../../data/notes';
import { ControlledComponentProps, NavigationProps } from '../../data/props';
import NoteMatrix from './NoteMatrix';

function MatrixBlock({
    value,
    onChange,
    ...props
}: ControlledComponentProps<WithKey<MatrixBlockData>> & NavigationProps) {
    const [cells, setCells] = usePropState(value, onChange, 'cells');
    
    return <NoteMatrix value={cells} onChange={setCells} {...props} />
}

export default MatrixBlock;
