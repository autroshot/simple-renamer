import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
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
import Versions from './components/Versions';
import { CHANNELS } from './constants';

function App(): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [files, setFiles] = useState<File[]>([
    {
      oldName: 'awesome file1',
      newName: 'awesome file1',
      path: 'C:Users/User/Desktop/프로그래밍',
    },
    {
      oldName: 'awesome file2',
      newName: 'awesome file2',
      path: 'C:Users/User/Desktop/프로그래밍',
    },
    {
      oldName: 'awesome file3',
      newName: 'awesome file3',
      path: 'C:Users/User/Desktop/프로그래밍',
    },
    {
      oldName: 'awesome file4',
      newName: 'awesome file4',
      path: 'C:Users/User/Desktop/프로그래밍',
    },
    {
      oldName: 'awesome file5',
      newName: 'awesome file5',
      path: 'C:Users/User/Desktop/프로그래밍',
    },
    {
      oldName: 'awesome file6',
      newName: 'awesome file6',
      path: 'C:Users/User/Desktop/프로그래밍',
    },
    {
      oldName: 'awesome file7',
      newName: 'awesome file7',
      path: 'C:Users/User/Desktop/프로그래밍',
    },
    {
      oldName: 'awesome file8',
      newName: 'awesome file8',
      path: 'C:Users/User/Desktop/프로그래밍',
    },
    {
      oldName: 'awesome file9',
      newName: 'awesome file9',
      path: 'C:Users/User/Desktop/프로그래밍',
    },
    {
      oldName: 'awesome file10',
      newName: 'awesome file10',
      path: 'C:Users/User/Desktop/프로그래밍',
    },
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    window.api.openFile((_event, fullPaths) => {
      const newFiles = fullPaths.map(toFile).filter((newFile) => !isDuplicatedFile(newFile, files));
      setFiles([...files, ...newFiles]);
    });

    return () => {
      window.api.removeAllListeners(CHANNELS.openFile);
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
    <>
      <Versions />
      <Box ms="3">
        <Box mt="3">
          <Button onClick={(): void => setFiles([])}>목록 제거</Button>
        </Box>
        <Box mt="3">
          <Button onClick={(): void => onOpen()}>문자 붙이기</Button>
        </Box>
        <Flex>
          <Button
            w="100%"
            h="20"
            mt="3"
            onDrop={(e): void => {
              e.preventDefault();
              e.stopPropagation();
              console.log(e.dataTransfer.files);
            }}
            onDragOver={(e): void => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            추가할 파일을 이곳에 끌어다 놓으세요.
          </Button>
        </Flex>
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
          </Tbody>
        </Table>
      </TableContainer>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={submitHandler}>
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
              <Button variant="ghost" onClick={onClose}>
                취소
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );

  function submitHandler(e: React.FormEvent<HTMLFormElement>): void {
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
    onClose();
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

interface File {
  oldName: string;
  newName: string;
  path: string;
}

type AddPosition = 'before' | 'after';

export default App;
