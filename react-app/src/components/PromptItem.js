import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Badge,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Input,
  useDisclosure,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { getAllCategories, getLLMById } from '../indexeddb';

function PromptItem({ prompt }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCopied, setIsCopied] = useState(false);
  const [argumentsValues, setArgumentsValues] = useState({});
  const [argumentsList, setArgumentsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [llm, setLLM] = useState(null);

  // Fetch categories and LLM data on component mount
  useEffect(() => {
    async function fetchCategoriesAndLLM() {
      const allCategories = await getAllCategories();
      setCategories(allCategories);
      
      const llmData = await getLLMById(prompt.llm);
      setLLM(llmData);
    }
    fetchCategoriesAndLLM();
  }, [prompt.llm]);

  // Extract arguments from prompt content and set initial values
  useEffect(() => {
    const args = [...prompt.content.matchAll(/{(.*?)}/g)].map(match => match[1]);
    setArgumentsList(args);
    setArgumentsValues(args.reduce((acc, arg) => ({ ...acc, [arg]: '' }), {}));

    // Set the category name based on the category ID
    const category = categories.find(cat => cat.id === prompt.category);
    setCategoryName(category ? category.name : 'Unknown');
  }, [prompt.content, categories, prompt.category]);

  // Handle copy to clipboard
  const copyToClipboard = () => {
    let content = prompt.content;
    argumentsList.forEach(arg => {
      content = content.replace(`{${arg}}`, argumentsValues[arg] || '');
    });
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    onOpen();
  };

  // Auto-close the modal after copy
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        onClose();
        setIsCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied, onClose]);

  // Handle argument input change
  const handleInputChange = (arg, value) => {
    setArgumentsValues(prevState => ({
      ...prevState,
      [arg]: value,
    }));
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" p={6} mb={4} bg="gray.50" shadow="md">
      <HStack justify="space-between" alignItems="start">
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={2}>{prompt.title}</Text>
          <Badge colorScheme="teal" fontSize="0.9em">{categoryName}</Badge>
          {llm && (
            <Badge ml={2} colorScheme={llm.type === 'specific' ? 'blue' : 'green'} fontSize="0.9em">
              {llm.name}
            </Badge>
          )}
        </Box>
        <Tooltip label="Copy prompt" fontSize="md">
          <IconButton
            aria-label="Copy prompt"
            icon={<CopyIcon />}
            onClick={copyToClipboard}
            colorScheme="blue"
            size="lg"
            variant="outline"
          />
        </Tooltip>
      </HStack>
      <Text mt={4} fontSize="md" color="gray.700">{prompt.content}</Text>
      <VStack align="start" mt={4} spacing={3}>
        {argumentsList.map(arg => (
          <Input
            key={arg}
            placeholder={`Value for ${arg}`}
            value={argumentsValues[arg]}
            onChange={(e) => handleInputChange(arg, e.target.value)}
            bg="white"
            borderColor="gray.300"
            focusBorderColor="teal.500"
            size="md"
          />
        ))}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Prompt copied</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            The prompt has been copied to the clipboard with the arguments injected.
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default PromptItem;
