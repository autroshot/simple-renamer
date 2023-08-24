import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { File } from '@renderer/types';

export default function FileRenameCompletionModal({
  isOpen,
  onClose,
  unChangedFiles,
}: Props): JSX.Element {
  const isUnChangedFileExist = unChangedFiles.length === 0 ? false : true;

  return (
    <Modal size={isUnChangedFileExist ? 'full' : 'md'} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>알림</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            {isUnChangedFileExist ? (
              <>
                <Box>오류가 발생하여 다음 파일이 변환되지 않았습니다.</Box>
                <TableContainer mt={3}>
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>기존 이름</Th>
                        <Th>새 이름</Th>
                        <Th>경로</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {unChangedFiles.map((file) => (
                        <Tr key={`${file.path}\\${file.oldName}`}>
                          <Td>{file.oldName}</Td>
                          <Td>{file.newName}</Td>
                          <Td>{file.path}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              '모든 파일의 변환이 완료되었습니다.'
            )}
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>확인</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  unChangedFiles: File[];
}
