/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */
const path = require('path');

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// SPA routing: serve index.html for all non-file routes using RegExp to avoid path-to-regexp issues
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
