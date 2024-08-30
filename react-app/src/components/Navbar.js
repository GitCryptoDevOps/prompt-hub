import React from 'react';
import { Box, Flex, HStack, Link, Heading } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <Box bg="teal.500" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Heading style={{ color: 'white' }} fontSize="2xl">
            PromptHub
        </Heading>
        <HStack spacing={8} alignItems="center">
          <HStack as="nav" spacing={4} display={{ base: 'none', md: 'flex' }}>
            <Link as={NavLink} to="/" color="white" fontSize="lg" _hover={{ color: 'gray.200' }}>
              Home
            </Link>
            <Link as={NavLink} to="/prompts" color="white" fontSize="lg" _hover={{ color: 'gray.200' }}>
              Manage Prompts
            </Link>
            <Link as={NavLink} to="/categories" color="white" fontSize="lg" _hover={{ color: 'gray.200' }}>
              Categories
            </Link>
            <Link as={NavLink} to="/llms" color="white" fontSize="lg" _hover={{ color: 'gray.200' }}>
              Manage LLMs
            </Link>
            <Link as={NavLink} to="/settings" color="white" fontSize="lg" _hover={{ color: 'gray.200' }}>
              Settings
            </Link>
          </HStack>
        </HStack>
      </Flex>
    </Box>
  );
}

export default Navbar;
