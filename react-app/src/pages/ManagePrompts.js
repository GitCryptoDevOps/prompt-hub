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
  HStack,
  Select,
} from '@chakra-ui/react';
import { getAllPrompts, addPrompt, updatePrompt, deletePrompt, getAllCategories, getAllLLMs, getPromptsByLLM } from '../indexeddb';
import PromptForm from '../components/PromptForm';
import { DeleteIcon, EditIcon, CopyIcon } from '@chakra-ui/icons';

function ManagePrompts() {
  const [allPrompts, setAllPrompts] = useState([]); // Store all prompts
  const [filteredPrompts, setFilteredPrompts] = useState([]); // Store filtered prompts
  const [categories, setCategories] = useState([]);
  const [llms, setLLMs] = useState([]);
  const [editPrompt, setEditPrompt] = useState(null);
  const [selectedLLM, setSelectedLLM] = useState('All');

  useEffect(() => {
    async function fetchData() {
      const allPromptsData = await getAllPrompts();
      const allCategories = await getAllCategories();
      const allLLMs = await getAllLLMs();
      setAllPrompts(allPromptsData); // Store the complete list of prompts
      setFilteredPrompts(allPromptsData); // Initially show all prompts
      setCategories(allCategories);
      setLLMs(allLLMs);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchPromptsByLLM() {
      let filtered;
      if (selectedLLM === 'generic') {
        // Filter for prompts with "generic" in the llm field
        filtered = allPrompts.filter(prompt => prompt.llm === 'generic');
      } else if (selectedLLM === 'All') {
        // Show all prompts if "All" is selected
        filtered = allPrompts;
      } else {
        // Filter prompts by specific LLM ID
        filtered = allPrompts.filter(prompt => prompt.llm === selectedLLM);
      }
      setFilteredPrompts(filtered);
    }
    fetchPromptsByLLM();
  }, [selectedLLM, allPrompts]); // Watch both selectedLLM and allPrompts

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getLLMName = (llmId) => {
    console.log("llms");
    console.log(llms);
    const llm = llms.find(model => model.id === llmId);
    return llm ? llm.name : 'Generic';
  };

  const handleAddPrompt = async (newPrompt) => {
    if (editPrompt) {
      await updatePrompt(editPrompt.id, { ...newPrompt, usageCount: editPrompt.usageCount });
    } else {
      await addPrompt({ ...newPrompt, usageCount: 0 });
    }
    const allPromptsData = await getAllPrompts();
    setAllPrompts(allPromptsData);
    setFilteredPrompts(allPromptsData); // Update filtered prompts
    setEditPrompt(null);
  };

  const handleEditPrompt = (prompt) => {
    setEditPrompt(prompt);
  };

  const handleDeletePrompt = async (id) => {
    await deletePrompt(id);
    const allPromptsData = await getAllPrompts();
    setAllPrompts(allPromptsData);
    setFilteredPrompts(allPromptsData); // Update filtered prompts
  };

  const handleCancelEdit = () => {
    setEditPrompt(null);
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    alert('Prompt copied to clipboard!');
  };

  return (
    <Container maxW="container.xl" p={3}>
      <Box bg="gray.50" borderRadius="lg" shadow="md" p={4}>
        <Heading mb={4} color="brand.500" fontSize="3xl">Manage prompts</Heading>
        <HStack mb={4}>
          <Select
            value={selectedLLM}
            onChange={(e) => setSelectedLLM(e.target.value)}
            bg="white"
            borderColor="gray.300"
            focusBorderColor="brand.500"
            maxW="300px"
          >
            <option value="All">All LLMs</option>
            <option value="generic">Generic</option> {/* Option for Generic prompts */}
            {llms.map((llm) => (
              <option key={llm.id} value={llm.id}>
                {llm.name}
              </option>
            ))}
          </Select>
        </HStack>
        <PromptForm addPrompt={handleAddPrompt} editPrompt={editPrompt} onCancelEdit={handleCancelEdit} />
        <Box mt={6}>
          <Table variant="simple" bg="white" borderRadius="md" shadow="sm">
            <Thead bg="brand.500">
              <Tr>
                <Th color="white" fontSize="lg">Title</Th>
                <Th color="white" fontSize="lg">Category</Th>
                <Th color="white" fontSize="lg">LLM</Th>
                <Th color="white" fontSize="lg">Status</Th>
                <Th color="white" fontSize="lg">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredPrompts.length > 0 ? (
                filteredPrompts.map((prompt) => (
                  <Tr key={prompt.id}>
                    <Td fontSize="lg">{prompt.title}</Td>
                    <Td fontSize="lg">{getCategoryName(prompt.category)}</Td>
                    <Td fontSize="lg">{getLLMName(prompt.llm)}</Td>
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
                  <Td colSpan="5" textAlign="center">No prompts available</Td>
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
