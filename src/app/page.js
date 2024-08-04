'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore } from './firebase'; // Correct the import path
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import '@fontsource/roboto-mono'; // Import the Roboto Mono font

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: '#333', // Darker background
  color: 'white', // White text
  border: 'none',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  borderRadius: 4,
  fontFamily: 'Roboto Mono, monospace', // Futuristic font
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        const data = doc.data();
        inventoryList.push({ name: doc.id, ...data });
      });
      setInventory(inventoryList);
      console.log("Inventory fetched:", inventoryList); // Debugging statement
    } catch (error) {
      console.error("Error fetching inventory:", error); // Debugging statement
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }
      await updateInventory();
    } catch (error) {
      console.error("Error adding item:", error); // Debugging statement
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
        await updateInventory();
      } else {
        console.warn(`Item '${item}' does not exist in inventory.`); // Debugging statement
      }
    } catch (error) {
      console.error("Error removing item:", error); // Debugging statement
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      gap={2}
      bgcolor="#121212" // Dark background
      color="white" // White text
      fontFamily="Roboto Mono, monospace" // Futuristic font
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={1}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              size="small"
              InputProps={{
                style: { color: 'white' },
              }}
              InputLabelProps={{
                style: { color: 'grey' },
              }}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              size="small"
              style={{ backgroundColor: '#6200ea', color: 'white' }} // Dark button color
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button variant="contained" onClick={handleOpen} size="small" style={{ backgroundColor: '#6200ea', color: 'white' }}>
        Add New Item
      </Button>
      <TextField
        id="search"
        label="Search"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="small"
        InputProps={{
          style: { color: 'white' },
        }}
        InputLabelProps={{
          style: { color: 'grey' },
        }}
        style={{ marginBottom: '16px' }}
      />
      <Box width="100%" maxWidth="600px" borderRadius="8px" overflow="hidden">
        <Box
          height="60px"
          bgcolor="#333"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h4" color="white" textAlign="center">
            Inventory Items
          </Typography>
        </Box>
        <Stack width="100%" maxHeight="300px" spacing={1} overflow="auto" padding={2}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="50px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#444"
              borderRadius="4px"
              paddingX={2}
              boxShadow="0px 1px 3px rgba(0, 0, 0, 0.1)"
            >
              <Typography variant="body1" color="white">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="body1" color="white">
                {quantity !== undefined ? quantity : 'N/A'}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={() => addItem(name)} size="small" style={{ color: 'white', borderColor: 'white' }}>
                  Add
                </Button>
                <Button variant="outlined" color="error" onClick={() => removeItem(name)} size="small" style={{ color: 'white', borderColor: 'red' }}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
