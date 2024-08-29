import React from 'react';
import { VStack } from '@chakra-ui/react';
import PromptItem from './PromptItem';

function PromptList({ prompts, onDelete }) {
  return (
    <VStack align="start" spacing={4}>
      {prompts.map(prompt => (
        <PromptItem key={prompt.id} prompt={prompt} />
      ))}
    </VStack>
  );
}

export default PromptList;
