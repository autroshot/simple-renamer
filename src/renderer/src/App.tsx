import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import Versions from './components/Versions';

function App(): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);

  const [data] = useState<Files[]>([
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

  const columns = useMemo<ColumnDef<Files>[]>(
    () => [
      { accessorKey: 'oldName', header: '기존 이름' },
      { accessorKey: 'newName', header: '새 이름' },
      { accessorKey: 'path', header: '경로' },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data,
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
      <TableContainer>
        <Table size="sm">
          <Thead position="sticky" top="0" bg="white">
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    <Button
                      size="sm"
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
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

interface Files {
  oldName: string;
  newName: string;
  path: string;
}

export default App;
