import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';

const CategoryForm = ({ onSubmit, initialCategory = '' }) => {
  const [categoryName, setCategoryName] = useState(initialCategory);
  const toast = useToast();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (categoryName.trim() === '') {
      toast({
        title: 'Category name is required.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onSubmit(categoryName.trim());
    setCategoryName('');
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} borderWidth={1} borderRadius="md">
      <FormControl id="categoryName" mb={4}>
        <FormLabel>Category name</FormLabel>
        <Input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
        />
      </FormControl>
      <Button colorScheme="teal" type="submit">
        Save
      </Button>
    </Box>
  );
};

export default CategoryForm;
