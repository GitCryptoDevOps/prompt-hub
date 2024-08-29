import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Container,
} from '@chakra-ui/react';
import { getAllPrompts, addPrompt, updatePrompt, deletePrompt, getAllCategories } from '../indexeddb';
import PromptForm from '../components/PromptForm';
import { DeleteIcon, EditIcon, CopyIcon } from '@chakra-ui/icons';

function ManagePrompts() {
  const [prompts, setPrompts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editPrompt, setEditPrompt] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const allPrompts = await getAllPrompts();
      const allCategories = await getAllCategories();
      setPrompts(allPrompts);
      setCategories(allCategories);
    }
    fetchData();
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const handleAddPrompt = async (newPrompt) => {
    if (editPrompt) {
      // Update existing prompt
      await updatePrompt(editPrompt.id, { ...newPrompt, usageCount: editPrompt.usageCount });
    } else {
      // Add new prompt with initial usageCount of 0
      await addPrompt({ ...newPrompt, usageCount: 0 });
    }
    setEditPrompt(null);
    const allPrompts = await getAllPrompts();
    setPrompts(allPrompts);
  };

  const handleEditPrompt = (prompt) => {
    setEditPrompt(prompt);
  };

  const handleDeletePrompt = async (id) => {
    await deletePrompt(id);
    const allPrompts = await getAllPrompts();
    setPrompts(allPrompts);
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    alert('Prompt copied to clipboard!');
  };

  return (
    <Container maxW="container.xl" p={3}>
      <Box bg="gray.50" borderRadius="lg" shadow="md" p={4}>
        <Heading mb={4} color="brand.500" fontSize="3xl">Manage prompts</Heading>
        <PromptForm addPrompt={handleAddPrompt} editPrompt={editPrompt} />
        <Box mt={6}>
          <Table variant="simple" bg="white" borderRadius="md" shadow="sm">
            <Thead bg="brand.500">
              <Tr>
                <Th color="white" fontSize="lg">Title</Th>
                <Th color="white" fontSize="lg">Category</Th>
                <Th color="white" fontSize="lg">Status</Th>
                <Th color="white" fontSize="lg">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {prompts.length > 0 ? (
                prompts.map((prompt) => (
                  <Tr key={prompt.id}>
                    <Td fontSize="lg">{prompt.title}</Td>
                    <Td fontSize="lg">{getCategoryName(prompt.categoryId)}</Td>
                    <Td fontSize="lg">{prompt.active}</Td>
                    <Td>
                      <IconButton
                        aria-label="Copy prompt"
                        icon={<CopyIcon />}
                        onClick={() => copyToClipboard(prompt.content)}
                        mr={2}
                        colorScheme="blue"
                        size="lg"
                      />
                      <IconButton
                        aria-label="Edit prompt"
                        icon={<EditIcon />}
                        onClick={() => handleEditPrompt(prompt)}
                        mr={2}
                        colorScheme="yellow"
                        size="lg"
                      />
                      <IconButton
                        aria-label="Delete prompt"
                        icon={<DeleteIcon />}
                        onClick={() => handleDeletePrompt(prompt.id)}
                        colorScheme="red"
                        size="lg"
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="4" textAlign="center">No prompts available</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Container>
  );
}

export default ManagePrompts;
