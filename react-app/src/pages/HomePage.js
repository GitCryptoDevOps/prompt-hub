import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Select,
  SimpleGrid,
  Text,
  Input,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  HStack,
  Button,
  VStack,
  Container,
  Badge,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { getAllCategories, getPromptsByCategory, incrementUsageCount, getAllLLMs } from '../indexeddb';

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [llms, setLLMs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLLM, setSelectedLLM] = useState('All');
  const [prompts, setPrompts] = useState([]);
  const [argumentsValues, setArgumentsValues] = useState({});
  const [keyword, setKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const promptsPerPage = 20;

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch categories, LLMs, and prompts on component mount
  useEffect(() => {
    async function fetchData() {
      const allCategories = await getAllCategories();
      const allLLMs = await getAllLLMs();
      setCategories(allCategories);
      setLLMs(allLLMs);
      const allPrompts = await getPromptsByCategory('All');
      setPrompts(allPrompts);
    }
    fetchData();
  }, []);

  // Fetch prompts whenever selectedCategory, selectedLLM or keyword changes
  useEffect(() => {
    async function fetchPrompts() {
      const filteredPrompts = await getPromptsByCategory(selectedCategory);
      const keywordFilteredPrompts = filteredPrompts.filter(prompt =>
        (selectedLLM === 'All' || prompt.llm === selectedLLM) &&
        (prompt.title.toLowerCase().includes(keyword.toLowerCase()) ||
        prompt.content.toLowerCase().includes(keyword.toLowerCase()))
      );
      keywordFilteredPrompts.sort((a, b) => b.usageCount - a.usageCount);
      setPrompts(keywordFilteredPrompts);
      setArgumentsValues({});
    }
    fetchPrompts();
  }, [selectedCategory, selectedLLM, keyword]);

  // Find category name by category ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Find LLM name by LLM ID
  const getLLMName = (llmId) => {
    const llm = llms.find(model => model.id === llmId);
    return llm ? llm.name : 'Generic';
  };

  // Handle clipboard copy and increment usage count
  const copyToClipboard = async (prompt) => {
    let content = prompt.content;
    const args = [...prompt.content.matchAll(/{(.*?)}/g)].map(match => match[1]);
    args.forEach(arg => {
      content = content.replace(`{${arg}}`, argumentsValues[arg] || '');
    });
    navigator.clipboard.writeText(content);
    await incrementUsageCount(prompt.id);
    onOpen();
  };

  // Handle argument input changes
  const handleInputChange = (promptId, arg, value) => {
    setArgumentsValues(prevState => ({
      ...prevState,
      [`${promptId}-${arg}`]: value,
    }));
  };

  // Pagination
  const indexOfLastPrompt = currentPage * promptsPerPage;
  const indexOfFirstPrompt = indexOfLastPrompt - promptsPerPage;
  const currentPrompts = prompts.slice(indexOfFirstPrompt, indexOfLastPrompt);

  const totalPages = Math.ceil(prompts.length / promptsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container maxW="container.xl" p={3}>
      <Box bg="gray.50" borderRadius="lg" shadow="md" p={4}>
        <Heading mb={4} color="brand.500" fontSize="3xl">Prompt list</Heading>
        <HStack mb={4} spacing={4}>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            bg="white"
            borderColor="gray.300"
            focusBorderColor="brand.500"
            maxW="300px"
            fontSize="lg"
          >
            <option value="All">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <Select
            value={selectedLLM}
            onChange={(e) => setSelectedLLM(e.target.value)}
            bg="white"
            borderColor="gray.300"
            focusBorderColor="brand.500"
            maxW="300px"
            fontSize="lg"
          >
            <option value="All">All LLMs</option>
            <option value="generic">Generic</option>
            {llms.map((llm) => (
              <option key={llm.id} value={llm.id}>
                {llm.name}
              </option>
            ))}
          </Select>
          <Input
            placeholder="Search by keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            bg="white"
            borderColor="gray.300"
            focusBorderColor="brand.500"
            maxW="300px"
            fontSize="lg"
          />
        </HStack>

        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {currentPrompts.map((prompt) => (
            <Box key={prompt.id} bg="white" p={4} borderRadius="md" shadow="sm">
              <Heading fontSize="xl" mb={2}>{prompt.title}</Heading>
              <HStack mb={2}>
                <Badge colorScheme="teal">{getCategoryName(prompt.category)}</Badge>
                <Badge colorScheme={prompt.llm === 'generic' ? 'green' : 'blue'}>
                  {getLLMName(prompt.llm)}
                </Badge>
              </HStack>
              <Text fontSize="lg" color="gray.700">{prompt.content}</Text>
              <VStack mt={4} spacing={3} align="stretch">
                {[...prompt.content.matchAll(/{(.*?)}/g)].map((match, index) => (
                  <Input
                    key={index}
                    placeholder={`Value for ${match[1]}`}
                    value={argumentsValues[`${prompt.id}-${match[1]}`] || ''}
                    onChange={(e) => handleInputChange(prompt.id, match[1], e.target.value)}
                    bg="gray.50"
                    borderColor="gray.300"
                    focusBorderColor="brand.500"
                    fontSize="lg"
                  />
                ))}
              </VStack>
              <HStack mt={4} justify="space-between">
                <Text fontSize="sm" color="gray.400" fontStyle="italic">
                  {prompt.usageCount} {prompt.usageCount === 1 ? 'use' : 'uses'}
                </Text>
                <IconButton
                  aria-label="Copy prompt"
                  icon={<CopyIcon />}
                  onClick={() => copyToClipboard(prompt)}
                  colorScheme="blue"
                  size="lg"
                />
              </HStack>
            </Box>
          ))}
        </SimpleGrid>

        <HStack mt={6} justify="center" spacing={2}>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              colorScheme={index + 1 === currentPage ? 'teal' : 'gray'}
              fontSize="lg"
            >
              {index + 1}
            </Button>
          ))}
        </HStack>

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize="lg">Prompt Copied</ModalHeader>
            <ModalCloseButton />
            <ModalBody fontSize="lg">
              The prompt has been copied to the clipboard with the injected arguments.
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Container>
  );
}

export default HomePage;
