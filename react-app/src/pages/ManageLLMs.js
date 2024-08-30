import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  IconButton,
  Input,
  Button,
  Container,
} from '@chakra-ui/react';
import { getAllLLMs, addLLM, updateLLM, deleteLLM } from '../indexeddb';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

function ManageLLMs() {
  const [llms, setLLMs] = useState([]);
  const [editLLM, setEditLLM] = useState(null);
  const [llmName, setLLMName] = useState('');
  const [llmUrl, setLLMUrl] = useState('');

  useEffect(() => {
    async function fetchLLMs() {
      const allLLMs = await getAllLLMs();
      setLLMs(allLLMs);
    }
    fetchLLMs();
  }, []);

  const handleAddLLM = async () => {
    if (editLLM) {
      await updateLLM(editLLM.id, llmName, llmUrl);
    } else {
      await addLLM(llmName, llmUrl);
    }
    setLLMName('');
    setLLMUrl('');
    setEditLLM(null);
    setLLMs(await getAllLLMs());
  };

  const handleEditLLM = (llm) => {
    setEditLLM(llm);
    setLLMName(llm.name);
    setLLMUrl(llm.url);
  };

  const handleDeleteLLM = async (id) => {
    await deleteLLM(id);
    setLLMs(await getAllLLMs());
  };

  const handleCancelEdit = () => {
    setLLMName('');
    setLLMUrl('');
    setEditLLM(null);
  };

  return (
    <Container maxW="container.xl" p={3}>
      <Box bg="gray.50" borderRadius="lg" shadow="md" p={4}>
        <Heading mb={4} color="brand.500" fontSize="3xl">Manage LLMs</Heading>
        <VStack mb={4} spacing={4}>
          <Input
            placeholder="LLM Name"
            value={llmName}
            onChange={(e) => setLLMName(e.target.value)}
            bg="white"
            borderColor="gray.300"
            focusBorderColor="brand.500"
            fontSize="lg"
          />
          <Input
            placeholder="LLM URL"
            value={llmUrl}
            onChange={(e) => setLLMUrl(e.target.value)}
            bg="white"
            borderColor="gray.300"
            focusBorderColor="brand.500"
            fontSize="lg"
          />
          <HStack spacing={4}>
            <Button 
              onClick={handleAddLLM} 
              colorScheme="brand" 
              fontSize="lg"
              minWidth="150px" // Set minimum width to prevent text cut-off
            >
              {editLLM ? 'Update LLM' : 'Add LLM'}
            </Button>
            {editLLM && (
              <Button 
                onClick={handleCancelEdit} 
                colorScheme="red" 
                fontSize="lg"
                minWidth="150px" // Set minimum width to match
              >
                Cancel
              </Button>
            )}
          </HStack>
        </VStack>
        <VStack align="start" spacing={4}>
          {llms.map((llm) => (
            <HStack key={llm.id} justifyContent="space-between" width="100%" bg="white" p={4} borderRadius="md" shadow="sm">
              <Text fontSize="lg" color="gray.800" fontWeight="medium">{llm.name}</Text>
              <Text fontSize="lg" color="gray.800">{llm.url}</Text>
              <HStack>
                <IconButton
                  aria-label="Edit LLM"
                  icon={<EditIcon />}
                  onClick={() => handleEditLLM(llm)}
                  colorScheme="yellow"
                  size="lg"
                />
                <IconButton
                  aria-label="Delete LLM"
                  icon={<DeleteIcon />}
                  onClick={() => handleDeleteLLM(llm.id)}
                  colorScheme="red"
                  size="lg"
                />
              </HStack>
            </HStack>
          ))}
        </VStack>
      </Box>
    </Container>
  );
}

export default ManageLLMs;
