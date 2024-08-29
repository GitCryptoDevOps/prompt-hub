import React from 'react';
import { Box, Text, Link, HStack } from '@chakra-ui/react';

function Footer() {
  return (
    <Box as="footer" bg="brand.500" color="white" py={4} mt={8}>
      <HStack justifyContent="center" spacing={4}>
        <Text fontSize="md">
          © 2024 by Bruno Delb
        </Text>
        <Link href="https://medium.com/@BrunoDelb" isExternal fontSize="md">
          Medium
        </Link>
        <Link href="https://www.linkedin.com/in/brunodelb" isExternal fontSize="md">
          LinkedIn
        </Link>
        <Link href="https://www.youtube.com/@CryptoDevOpsAI" isExternal fontSize="md">
          Youtube
        </Link>
      </HStack>
    </Box>
  );
}

export default Footer;
