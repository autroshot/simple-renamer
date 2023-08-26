import {
  Box,
  Button,
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
} from '@chakra-ui/react';

export default function AddTextModal({ isOpen, onClose, onSubmit }: Props): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={onSubmit}>
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
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
