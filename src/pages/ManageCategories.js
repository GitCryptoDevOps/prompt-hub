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
import { getAllCategories, addCategory, updateCategory, deleteCategory } from '../indexeddb';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      const allCategories = await getAllCategories();
      setCategories(allCategories);
    }
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (editCategory) {
      await updateCategory(editCategory.id, categoryName); // Utiliser l'ID pour la mise à jour
    } else {
      await addCategory(categoryName);
    }
    setCategoryName('');
    setEditCategory(null);
    setCategories(await getAllCategories());
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setCategoryName(category.name); // Afficher le nom de la catégorie à modifier
  };

  const handleDeleteCategory = async (id) => {
    await deleteCategory(id);
    setCategories(await getAllCategories());
  };

  return (
    <Container maxW="container.xl" p={3}>
      <Box bg="gray.50" borderRadius="lg" shadow="md" p={4}>
        <Heading mb={4} color="brand.500" fontSize="3xl">Manage categories</Heading>
        <HStack mb={4} spacing={4}>
          <Input
            placeholder="New category"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            bg="white"
            borderColor="gray.300"
            focusBorderColor="brand.500"
            fontSize="lg"
          />
          <Button onClick={handleAddCategory} colorScheme="brand" fontSize="lg">
            {editCategory ? 'Update' : 'Add'}
          </Button>
        </HStack>
        <VStack align="start" spacing={4}>
          {categories.map((category) => (
            <HStack key={category.id} justifyContent="space-between" width="100%" bg="white" p={4} borderRadius="md" shadow="sm">
              <Text fontSize="lg" color="gray.800" fontWeight="medium">{category.name}</Text>
              <HStack>
                <IconButton
                  aria-label="Edit category"
                  icon={<EditIcon />}
                  onClick={() => handleEditCategory(category)}
                  mr={2}
                  colorScheme="yellow"
                  size="lg"
                />
                <IconButton
                  aria-label="Delete category"
                  icon={<DeleteIcon />}
                  onClick={() => handleDeleteCategory(category.id)} // Passer l'ID pour la suppression
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

export default ManageCategories;
