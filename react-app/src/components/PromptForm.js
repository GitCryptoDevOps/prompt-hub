import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Textarea,
  Select,
  Switch,
  FormControl,
  FormLabel,
  HStack,
} from '@chakra-ui/react';
import { getAllCategories, getAllLLMs } from '../indexeddb';

function PromptForm({ addPrompt, editPrompt, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [active, setActive] = useState(true);
  const [llm, setLLM] = useState('');
  const [categories, setCategories] = useState([]);
  const [llms, setLLMs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const allCategories = await getAllCategories();
      const allLLMs = await getAllLLMs();
      setCategories(allCategories);
      setLLMs(allLLMs);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (editPrompt) {
      setTitle(editPrompt.title);
      setCategory(editPrompt.category);
      setContent(editPrompt.content);
      setActive(editPrompt.active === 'Active');
      setLLM(editPrompt.llm || '');
    } else {
      setTitle('');
      setCategory('');
      setContent('');
      setActive(true);
      setLLM('');
    }
  }, [editPrompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPrompt = {
      title,
      category,
      content,
      llm: llm || 'generic',
      active: active ? 'Active' : 'Inactive',
    };
    addPrompt(newPrompt);
    setTitle('');
    setCategory('');
    setContent('');
    setActive(true);
    setLLM('');
  };

  return (
    <Box as="form" onSubmit={handleSubmit} mb={6} bg="white" p={4} borderRadius="md" shadow="sm">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        mb={3}
        bg="gray.50"
        borderColor="gray.300"
        focusBorderColor="teal.500"
      />
      <Select
        placeholder="Select a category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        mb={3}
        bg="gray.50"
        borderColor="gray.300"
        focusBorderColor="teal.500"
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </Select>
      <Select
        placeholder="Select an LLM or 'generic'"
        value={llm}
        onChange={(e) => setLLM(e.target.value)}
        mb={3}
        bg="gray.50"
        borderColor="gray.300"
        focusBorderColor="teal.500"
      >
        <option value="generic">Generic</option>
        {llms.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </Select>
      <Textarea
        placeholder="Prompt content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        mb={3}
        bg="gray.50"
        borderColor="gray.300"
        focusBorderColor="teal.500"
      />
      <FormControl display="flex" alignItems="center" mb={3}>
        <FormLabel htmlFor="active-toggle" mb="0">
          Active
        </FormLabel>
        <Switch
          id="active-toggle"
          isChecked={active}
          onChange={(e) => setActive(e.target.checked)}
          colorScheme="teal"
        />
      </FormControl>
      <HStack>
        <Button type="submit" colorScheme="teal" width="100%">
          {editPrompt ? 'Update prompt' : 'Add prompt'}
        </Button>
        {editPrompt && (
          <Button onClick={onCancelEdit} colorScheme="gray" width="100%">
            Cancel
          </Button>
        )}
      </HStack>
    </Box>
  );
}

export default PromptForm;
