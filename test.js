const command = require('./bin/commands/file.command');
const dir = 'D:\\projetos\\VSTS\\Infosistemas';
const env = 'development';
new command().commandArgs(dir, env);