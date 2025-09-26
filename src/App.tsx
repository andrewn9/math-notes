import { useEffect, useRef, useState } from 'react';
// Theme toggle icon
function ThemeToggleIcon({ dark }: { dark: boolean }) {
    return dark ? (
        // Moon icon
        <svg className='icon' viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 0111.21 3a7 7 0 100 14 9 9 0 009.79-4.21z" stroke="currentColor" strokeWidth="2" /></svg>
    ) : (
        // Sun icon
        <svg className='icon' viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2"/></svg>
    );
}
import { BlockData, NoteBlockData } from './data/notes';
import { KeyedArray, addKey } from './data/keys';
import Document from './components/notes/Document';
import {
    SerializedDocument,
    deserializeDocument,
    documentToMarkdown,
    serializeDocument,
} from './data/serialize';
import { safeFileName } from './file';
import { dataFixerUpper } from './data/legacy';
import DownloadButton from './components/control/DownloadButton';
import UploadButton from './components/control/UploadButton';
import {
    DownloadIcon,
    OpenIcon,
    MarkdownIcon,
    PrintIcon,
    RecoveryIcon,
} from './icons';
import ExportDialog from './components/ExportDialog';
import Tooltip from './components/Tooltip';
import DialogButton from './components/DialogButton';
import { useHistory } from './useHistory';
import DropdownButton from './components/DropdownButton';
import { useRecovery } from './useRecovery';
import { useLocalStorage } from '@tater-archives/react-use-localstorage';

function App() {

    // Toggle for bottom left button group
    const [showControls, setShowControls] = useState(true);

    // Dark mode state
    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem('theme');
        if (stored) return stored === 'dark';
        // Default to light mode for first time users
        return false;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);
    const [title, setTitle] = useState('');
    const [blocks, setBlocks] = useState<KeyedArray<BlockData>>(() => [
        addKey(NoteBlockData('')),
    ]);

    const [appendJson, setAppendJson] = useLocalStorage(false, 'appendJson')

    const [undo, redo, replaceHistory, setSaved, saved] = useHistory(
        blocks,
        setBlocks
    );

    const loadSerialized = (serialized: SerializedDocument) => {
        const document = dataFixerUpper(serialized);
        setTitle(document.title);
        replaceHistory(deserializeDocument(document.blocks));
    };

    const [recoveryOptions, loadRecovery] = useRecovery(
        title,
        blocks,
        saved,
        blocks => serializeDocument(title, blocks),
        loadSerialized
    );

    const savedRef = useRef(saved);
    savedRef.current = saved;

    // Set tab title
    useEffect(() => {
        document.title = title ? `${title}` : 'we love math quill';
    }, [title]);

    // Add handler to prevent unloading page when unsaved
    useEffect(() => {
        const handler = (event: BeforeUnloadEvent) => {
            // Disable prevent reload if in DEV mode
            if (import.meta.env.PROD && !savedRef.current) {
                event.preventDefault();
            }
        };

        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, []);

    const confirmReplace = () => {
        return saved || confirm('Replace current document?');
    };

    const handleUpload = (data: string) => {
        if (!confirmReplace()) return;
        loadSerialized(JSON.parse(data));
    };

    const provideDownload = () => {
        setSaved();
        return JSON.stringify(serializeDocument(title, blocks));
    };

    return (
        <main className='mx-auto max-w-5xl p-8 print:p-0'>
            <h1 className='my-8 text-3xl sm:text-4xl lg:text-5xl'>
                <input
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    placeholder='Title'
                    className='w-full text-center outline-none placeholder:italic dark:placeholder:text-gray-600'
                />
            </h1>

            <Document
                value={blocks}
                onChange={setBlocks}
                onUndo={undo}
                onRedo={redo}
            />

            <Tooltip
                className='fixed right-4 top-4'
                localStorageKey='usageHintShown'>
                Type <code>$$</code> to insert math, write <code>\table</code>, <code>\matrix</code>,{' '}
                or <code>\embed</code> on an empty line to create a table, matrix, or
                embed respectively
            </Tooltip>

            <div className='fixed bottom-4 left-4 flex flex-row gap-2 rounded-lg bg-white/80 p-4 dark:bg-gray-800/80 print:hidden lg:gap-3'>
                <>
                    {showControls && (
                        <>
                            <DownloadButton
                                filename={`${safeFileName(title) || 'Untitled'}.json`}
                                content={provideDownload}
                                className='button'
                                title='Save and download'>
                                <DownloadIcon className='icon' />
                            </DownloadButton>
                            <UploadButton
                                onUpload={handleUpload}
                                className='button'
                                title='Open file'>
                                <OpenIcon className='icon' />
                            </UploadButton>
                            <button className='button' onClick={print} title='Print'>
                                <PrintIcon className='icon' />
                            </button>
                            <DialogButton
                                className='button'
                                dialogClassName='flex flex-col gap-4'
                                title='Export as markdown'
                                dialogContent={
                                    <ExportDialog
                                        provideContent={() => documentToMarkdown(title, blocks, appendJson)}
                                        onDownload={setSaved}
                                        filename={`${safeFileName(title) || 'Untitled'}.md`}
                                        appendJson={appendJson}
                                        onChangeAppendJson={setAppendJson}
                                    />
                                }>
                                <MarkdownIcon className='icon' />
                            </DialogButton>
                            {recoveryOptions.length > 0 && (
                                <DropdownButton
                                    className='button'
                                    title='Recover unsaved documents'
                                    dropdownContent={
                                        <div className='my-1 flex max-h-64 flex-col gap-2px divide-y-2 divide-white overflow-y-auto rounded-lg dark:divide-gray-800'>
                                            {recoveryOptions.map((e, i) => (
                                                <button
                                                    key={i}
                                                    className='button w-auto rounded-none px-2 py-1 text-left'
                                                    onClick={() => {
                                                        if (!confirmReplace()) return;
                                                        loadRecovery(e);
                                                    }}>
                                                    {e || <em>Untitled</em>}
                                                </button>
                                            ))}
                                        </div>
                                    }>
                                    <RecoveryIcon className='icon' />
                                </DropdownButton>
                            )}
                            {/* Dark mode toggle button */}
                            <button
                                className='button'
                                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                onClick={() => setDarkMode(d => !d)}
                            >
                                <ThemeToggleIcon dark={darkMode} />
                            </button>
                        </>
                    )}
                    <button
                        className='button'
                        title={showControls ? 'Hide controls' : 'Show controls'}
                        onClick={() => setShowControls(v => !v)}
                    >
                        {showControls ? '⏷' : '⏶'}
                    </button>
                </>
            </div>

        </main>
    );
}

export default App;
