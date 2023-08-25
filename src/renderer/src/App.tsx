import { AddIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
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
import { useEffect, useMemo, useState } from 'react';
import FileRenameCompletionModal from './components/FileRenameCompletionModal';
import Versions from './components/Versions';
import { CHANNELS } from './constants';
import { File, FullPathPair } from './types';

function App(): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [fileRenameResults, setFileRenameResults] = useState<boolean[]>([]);
  const {
    isOpen: isFormModalOpen,
    onOpen: onFormModalOpen,
    onClose: onFormModalClose,
  } = useDisclosure();
  const {
    isOpen: isNotificationModalOpen,
    onOpen: onNotificationModalOpen,
    onClose: onNotificationModalClose,
  } = useDisclosure();

  useEffect(() => {
    window.api.openFileMenu((_event, fullPaths) => {
      const newFiles = fullPaths.map(toFile).filter((newFile) => !isDuplicatedFile(newFile, files));
      setFiles([...files, ...newFiles]);
    });

    return () => {
      window.api.removeAllListeners(CHANNELS.openFileMenu);
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
    <Box onDrop={handleDrop} onDragOver={handleDropOver} minH="610">
      <Versions />
      <Box ms="3">
        <HStack mt="3" spacing={3}>
          <Button onClick={handleAddFiles}>파일 추가</Button>
          <Button onClick={(): void => setFiles([])}>목록 지우기</Button>
        </HStack>
        <HStack mt="3" spacing={3}>
          <Button onClick={(): void => onFormModalOpen()}>문자 붙이기</Button>
          <Button onClick={handleNameRemove}>이름 지우기</Button>
          <Button onClick={handleNameRevert}>기존 이름으로</Button>
        </HStack>
        <Box mt="3">
          <Button onClick={handleFileNameChange}>변경 적용</Button>
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
      <Modal isOpen={isFormModalOpen} onClose={onFormModalClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent>
            <ModalHeader>문자 붙이기</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                <RadioGroup name="position" defaultValue="before">
                  <Stack direction="row">
                    <Radio value="before">이름 앞에 붙이기</Radio>
                    <Radio value="after">이름 뒤에 붙이기</Radio>
                  </Stack>
                </RadioGroup>
              </Box>
              <Box mt={3}>
                <FormControl variant="floating">
                  <Input name="text" placeholder=" " />
                  <FormLabel>문자</FormLabel>
                </FormControl>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="blue" mr={3}>
                적용
              </Button>
              <Button variant="ghost" onClick={onFormModalClose}>
                취소
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
      <FileRenameCompletionModal
        isOpen={isNotificationModalOpen}
        onClose={onNotificationModalClose}
        unChangedFiles={files.filter((_file, index) => fileRenameResults[index] === false)}
      />
    </Box>
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      position: { value: AddPosition };
      text: { value: string };
    };
    const position = target.position.value;
    const text = target.text.value;

    const newFiles = files.map((file) => {
      const newFile = { ...file };
      if (position === 'before') {
        newFile.newName = text.concat(file.newName);
      }
      if (position === 'after') {
        const periodIndex = file.newName.lastIndexOf('.');
        if (periodIndex === -1) {
          newFile.newName = file.newName.concat(text);
        } else {
          newFile.newName = `${file.newName.slice(0, periodIndex)}${text}.${file.newName.slice(
            periodIndex + 1
          )}`;
        }
      }
      return newFile;
    });

    setFiles(newFiles);
    onFormModalClose();
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    e.stopPropagation();

    const newFiles = Array.from(e.dataTransfer.files)
      .map(getFullPath)
      .map(toFile)
      .filter((newFile) => !isDuplicatedFile(newFile, files));
    setFiles([...files, ...newFiles]);

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
    const newFiles = fullPaths.map(toFile).filter((newFile) => !isDuplicatedFile(newFile, files));
    setFiles([...files, ...newFiles]);
  }

  function handleNameRemove(): void {
    const newFiles = files.map<File>((file) => {
      const newFile = { ...file };

      const periodIndex = file.newName.lastIndexOf('.');
      if (periodIndex === -1) {
        newFile.newName = '';
      } else {
        newFile.newName = `.${file.newName.slice(periodIndex + 1)}`;
      }

      return newFile;
    });
    setFiles(newFiles);
  }

  function handleNameRevert(): void {
    const newFiles = files.map<File>((file) => {
      return { oldName: file.oldName, newName: file.oldName, path: file.path };
    });
    setFiles(newFiles);
  }

  async function handleFileNameChange(): Promise<void> {
    const fullPathPairs: FullPathPair[] = files.map((file) => {
      return {
        from: `${file.path}\\${file.oldName}`,
        to: `${file.path}\\${file.newName}`,
      };
    });
    const results = await window.api.renameFile(fullPathPairs);
    const newFiles = files.map<File>((file, index) => {
      if (results[index] === true) {
        return { oldName: file.newName, newName: file.newName, path: file.path };
      }
      return { ...file };
    });
    setFiles(newFiles);
    setFileRenameResults(results);
    onNotificationModalOpen();
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
}

type AddPosition = 'before' | 'after';

export default App;
