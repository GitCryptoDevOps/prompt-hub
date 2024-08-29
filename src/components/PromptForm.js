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
} from '@chakra-ui/react';
import { getAllCategories } from '../indexeddb';

function PromptForm({ addPrompt, editPrompt }) {
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [content, setContent] = useState('');
  const [active, setActive] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const allCategories = await getAllCategories();
      setCategories(allCategories);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editPrompt) {
      setTitle(editPrompt.title);
      setCategoryId(editPrompt.categoryId); // Use categoryId
      setContent(editPrompt.content);
      setActive(editPrompt.active === 'Active');
    } else {
      setTitle('');
      setCategoryId('');
      setContent('');
      setActive(true);
    }
  }, [editPrompt]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPrompt = {
      title,
      categoryId, // Store categoryId
      content,
      active: active ? 'Active' : 'Inactive',
    };
    addPrompt(newPrompt);
    // Reset fields after addition
    setTitle('');
    setCategoryId('');
    setContent('');
    setActive(true);
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
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
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
      <Button type="submit" colorScheme="teal" width="100%">
        {editPrompt ? 'Update prompt' : 'Add prompt'}
      </Button>
    </Box>
  );
}

export default PromptForm;
