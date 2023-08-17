import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import Versions from './components/Versions';

function App(): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [files, setFiles] = useState<Files[]>([
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

  useEffect(() => {
    window.api.openFile((_event, filePaths) => {
      const newFiles: Files[] = [];

      filePaths.forEach((filePath) => {
        const { name, path } = getNameAndPath(filePath);

        const isDuplicated = files.some((file) => {
          return file.oldName === name && file.path === path;
        });

        if (!isDuplicated) {
          newFiles.push({ oldName: name, newName: name, path });
        }
      });

      setFiles([...files, ...newFiles]);

      function getNameAndPath(fullPath: string): NameAndPath {
        const name = fullPath.split('\\').pop() ?? '';
        let path = '';
        if (name.length === 0) {
          path = fullPath;
        } else {
          path = fullPath.slice(0, -name.length - 1);
        }
        return { name, path };
      }

      interface NameAndPath {
        name: string;
        path: string;
      }
    });

    return () => {
      window.api.removeAllListeners('open-file');
    };
  });

  const columns = useMemo<ColumnDef<Files>[]>(
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
      <Button size="sm" onClick={(): void => setFiles([])}>
        목록 제거
      </Button>
      <Table
        size="sm"
        w={table.getCenterTotalSize()}
        mt="3"
        whiteSpace="nowrap"
        style={{ tableLayout: 'fixed' }}
      >
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
    </>
  );
}

interface Files {
  oldName: string;
  newName: string;
  path: string;
}

export default App;
