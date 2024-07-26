import React from 'react';
import { createRoot } from 'react-dom/client';
import Root from './Root'; // Adjust the path to your Root component

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<Root />);
