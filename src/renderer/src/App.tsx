import { AddIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useReducer, useState } from 'react';
import AddTextModal from './components/AddTextModal';
import FileRenameCompletionModal from './components/FileRenameCompletionModal';
import { CHANNELS } from './constants';
import { File, FullPathPair } from './types';

function App(): JSX.Element {
  const [files, dispatch] = useReducer(filesReducer, []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [fileRenameResults, setFileRenameResults] = useState<boolean[]>([]);
  const {
    isOpen: isAddTextModalOpen,
    onOpen: onAddTextModalOpen,
    onClose: onAddTextModalClose,
  } = useDisclosure();
  const {
    isOpen: isNotificationModalOpen,
    onOpen: onNotificationModalOpen,
    onClose: onNotificationModalClose,
  } = useDisclosure();

  useEffect(() => {
    window.api.menu.openFile(async (_event, fullPaths) => {
      if (isFirstNewFile(fullPaths)) {
        await window.api.changeMenuItemEnabled(true);
      }
      dispatch({ type: 'added_files', fullPaths });
    });

    return () => {
      window.api.removeAllListeners(CHANNELS.menu.openFile);
    };
  });
  useEffect(() => {
    window.api.menu.clearList(async () => {
      await window.api.changeMenuItemEnabled(false);
      dispatch({ type: 'cleared_files' });
    });

    return () => {
      window.api.removeAllListeners(CHANNELS.menu.clearList);
    };
  });
  useEffect(() => {
    window.api.menu.addText(() => {
      onAddTextModalOpen();
    });

    return () => {
      window.api.removeAllListeners(CHANNELS.menu.addText);
    };
  });

  const columns = useMemo<ColumnDef<File>[]>(
    () => [
      { accessorKey: 'oldName', header: '기존 이름', size: 230, minSize: 100 },
      { accessorKey: 'newName', header: '새 이름', size: 230, minSize: 100 },
      { accessorKey: 'path', header: '경로', size: 350, minSize: 100 },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: files,
    columnResizeMode: 'onChange',
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Box onDrop={handleDrop} onDragOver={handleDropOver} minH="599">
      <Box ms="3">
        <HStack mt="3" spacing={3}>
          <Button onClick={handleAddFiles}>파일 추가</Button>
          <Button
            isDisabled={isFilesEmpty()}
            onClick={async (): Promise<void> => {
              await window.api.changeMenuItemEnabled(false);
              dispatch({ type: 'cleared_files' });
            }}
          >
            목록 지우기
          </Button>
        </HStack>
        <HStack mt="3" spacing={3}>
          <Button isDisabled={isFilesEmpty()} onClick={onAddTextModalOpen}>
            문자 붙이기
          </Button>
          <Button isDisabled={isFilesEmpty()} onClick={handleNameRemove}>
            이름 지우기
          </Button>
          <Button isDisabled={isFilesEmpty()} onClick={handleNameRevert}>
            기존 이름으로
          </Button>
        </HStack>
        <Box mt="3">
          <Button isDisabled={isFilesEmpty()} onClick={handleFileNameChange}>
            변경 적용
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table size="sm" w={table.getCenterTotalSize()} mt="3" style={{ tableLayout: 'fixed' }}>
          <Thead position="sticky" top="0">
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id} w={header.getSize()} p="0" bg="gray.300">
                    <Flex>
                      <Button
                        variant="unstyled"
                        size="sm"
                        flex="1"
                        borderRadius="0"
                        px="16px"
                        textAlign="left"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        rightIcon={
                          header.column.getIsSorted() ? (
                            header.column.getIsSorted() === 'desc' ? (
                              <TriangleDownIcon aria-label="sorted descending" />
                            ) : (
                              <TriangleUpIcon aria-label="sorted ascending" />
                            )
                          ) : undefined
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </Button>
                      <Box
                        w="6px"
                        bg={header.column.getIsResizing() ? 'blue.500' : 'gray.100'}
                        cursor="col-resize"
                        userSelect="none"
                        onMouseDown={header.getResizeHandler()}
                      >
                        &nbsp;
                      </Box>
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    w={cell.column.getSize()}
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
            <Tr>
              <Td colSpan={3} p="0">
                <Flex>
                  <Button w="100%" borderRadius="0" leftIcon={<AddIcon />} onClick={handleAddFiles}>
                    이곳을 클릭하여 추가할 파일을 선택하거나, 추가할 파일을 끌어다 놓으세요.
                  </Button>
                </Flex>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <AddTextModal
        isOpen={isAddTextModalOpen}
        onClose={onAddTextModalClose}
        onSubmit={handleAddText}
      />
      <FileRenameCompletionModal
        isOpen={isNotificationModalOpen}
        onClose={onNotificationModalClose}
        unChangedFiles={files.filter((_file, index) => fileRenameResults[index] === false)}
      />
    </Box>
  );

  function handleAddText(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      position: { value: AddPosition };
      text: { value: string };
    };

    onAddTextModalClose();
    dispatch({ type: 'added_text', position: target.position.value, text: target.text.value });
  }

  async function handleDrop(e: React.DragEvent<HTMLDivElement>): Promise<void> {
    e.preventDefault();
    e.stopPropagation();

    const fullPaths = Array.from(e.dataTransfer.files).map(getFullPath);
    if (isFirstNewFile(fullPaths)) {
      await window.api.changeMenuItemEnabled(true);
    }
    dispatch({ type: 'added_files', fullPaths });

    function getFullPath(file: globalThis.File): string {
      return file.path;
    }
  }

  function handleDropOver(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    e.stopPropagation();
  }

  async function handleAddFiles(): Promise<void> {
    const fullPaths = await window.api.openFile();
    if (isFirstNewFile(fullPaths)) {
      await window.api.changeMenuItemEnabled(true);
    }
    dispatch({ type: 'added_files', fullPaths });
  }

  function handleNameRemove(): void {
    dispatch({ type: 'removed_name' });
  }

  function handleNameRevert(): void {
    dispatch({ type: 'reverted_name' });
  }

  async function handleFileNameChange(): Promise<void> {
    const fullPathPairs: FullPathPair[] = files.map((file) => {
      return {
        from: `${file.path}\\${file.oldName}`,
        to: `${file.path}\\${file.newName}`,
      };
    });
    const results = await window.api.renameFile(fullPathPairs);

    setFileRenameResults(results);
    onNotificationModalOpen();
    dispatch({ type: 'applied_change', changeResults: results });
  }

  function toFile(fullPath: string): File {
    const name = getName(fullPath);
    const path = getPath(fullPath);

    return { oldName: name, newName: name, path };
  }

  function isDuplicatedFile(newfile: File, files: File[]): boolean {
    return files.some((preexistenceFile) => {
      return preexistenceFile.oldName === newfile.oldName && preexistenceFile.path === newfile.path;
    });
  }

  function isFirstNewFile(newFullPaths: string[]): boolean {
    return files.length === 0 && newFullPaths.length !== 0;
  }

  function isFilesEmpty(): boolean {
    return files.length === 0;
  }

  function getName(fullPath: string): string {
    return fullPath.split('\\').pop() ?? '';
  }

  function getPath(fullPath: string): string {
    const name = getName(fullPath);
    if (name.length === 0) {
      return fullPath;
    } else {
      return fullPath.slice(0, -name.length - 1);
    }
  }

  function getPeriodIndex(name: string): number {
    return name.lastIndexOf('.');
  }

  function getExtension(name: string, periodIndex: number): string {
    return name.slice(periodIndex + 1);
  }

  function getPureName(name: string, periodIndex: number): string {
    return name.slice(0, periodIndex);
  }

  function filesReducer(files: File[], action: Action): File[] {
    switch (action.type) {
      case 'added_files': {
        const newFiles = action.fullPaths
          .map(toFile)
          .filter((newFile) => !isDuplicatedFile(newFile, files));
        return [...files, ...newFiles];
      }
      case 'cleared_files': {
        return [];
      }
      case 'added_text': {
        const position = action.position;
        const text = action.text;

        const newFiles = files.map((file) => {
          const newFile = { ...file };
          if (position === 'before') {
            newFile.newName = text.concat(file.newName);
          }
          if (position === 'after') {
            const periodIndex = getPeriodIndex(file.newName);
            if (periodIndex === -1) {
              newFile.newName = file.newName.concat(text);
            } else {
              newFile.newName = `${getPureName(file.newName, periodIndex)}${text}.${getExtension(
                file.newName,
                periodIndex
              )}`;
            }
          }
          return newFile;
        });

        return newFiles;
      }
      case 'removed_name': {
        const newFiles = files.map<File>((file) => {
          const newFile = { ...file };

          const periodIndex = getPeriodIndex(file.newName);
          if (periodIndex === -1) {
            newFile.newName = '';
          } else {
            newFile.newName = `.${getExtension(file.newName, periodIndex)}`;
          }

          return newFile;
        });
        return newFiles;
      }
      case 'reverted_name': {
        const newFiles = files.map<File>((file) => {
          return { oldName: file.oldName, newName: file.oldName, path: file.path };
        });
        return newFiles;
      }
      case 'applied_change': {
        const newFiles = files.map<File>((file, index) => {
          if (action.changeResults[index] === true) {
            return { oldName: file.newName, newName: file.newName, path: file.path };
          }
          return { ...file };
        });
        return newFiles;
      }
    }
  }
}

type Action =
  | { type: 'added_files'; fullPaths: string[] }
  | { type: 'cleared_files' }
  | { type: 'added_text'; text: string; position: AddPosition }
  | { type: 'removed_name' }
  | { type: 'reverted_name' }
  | { type: 'applied_change'; changeResults: boolean[] };

type AddPosition = 'before' | 'after';

export default App;
