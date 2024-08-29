import React from 'react';
import { VStack, HStack, Text, Button } from '@chakra-ui/react';

function CategoryList({ categories, onDeleteCategory }) {
  return (
    <VStack align="start">
      {categories.map((category) => (
        <HStack key={category} justifyContent="space-between" width="100%">
          <Text>{category}</Text>
          <Button colorScheme="red" size="sm" onClick={() => onDeleteCategory(category)}>
            Delete
          </Button>
        </HStack>
      ))}
    </VStack>
  );
}

export default CategoryList;
