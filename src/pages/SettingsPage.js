import React from 'react';
import {
  Box,
  Heading,
  Button,
  HStack,
  Container,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { DownloadIcon, AttachmentIcon } from '@chakra-ui/icons';
import { exportDatabase, importDatabase } from '../indexeddb';

function SettingsPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleExport = () => {
    exportDatabase();
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      importDatabase(file, onOpen);
    }
  };

  return (
    <Container maxW="container.xl" p={3}>
      <Box bg="gray.50" borderRadius="lg" shadow="md" p={4}>
        <Heading mb={4} color="brand.500" fontSize="3xl">
          Application settings
        </Heading>
        <HStack mb={6} spacing={4}>
          <Button leftIcon={<DownloadIcon />} colorScheme="teal" onClick={handleExport}>
            Export database
          </Button>
          <Button as="label" leftIcon={<AttachmentIcon />} colorScheme="teal" cursor="pointer">
            Import database
            <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
          </Button>
        </HStack>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Import successful</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              The database has been successfully restored.
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={onClose}>
                OK
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Container>
  );
}

export default SettingsPage;
