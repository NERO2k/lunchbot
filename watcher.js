var spawn = require('child_process').spawn;
spawn('node', ['--experimental-modules', '--es-module-specifier-resolution=node', 'src/index.js'], {
  cwd: process.cwd(),
  detached: false,
  stdio: "inherit"
});