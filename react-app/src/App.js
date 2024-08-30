import React from 'react';
import { ChakraProvider, Container, Box, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';  // Importation du Footer
import HomePage from './pages/HomePage';
import ManageCategories from './pages/ManageCategories';
import ManagePrompts from './pages/ManagePrompts';
import ManageLLMs from './pages/ManageLLMs';
import SettingsPage from './pages/SettingsPage';
import theme from './theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Flex direction="column" minHeight="100vh">
          <Navbar />
          <Box as="main" flex="1" p={3}>
            <Container maxW="container.xl">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/prompts" element={<ManagePrompts />} />
                <Route path="/categories" element={<ManageCategories />} />
                <Route path="/llms" element={<ManageLLMs />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Container>
          </Box>
          <Footer />
        </Flex>
      </Router>
    </ChakraProvider>
  );
}

export default App;
