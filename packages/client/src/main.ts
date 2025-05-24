import { McpClient } from '@modelcontextprotocol/sdk';

// Connect to the MCP server running on localhost
const client = new McpClient({ server: 'http://localhost:3000' });

// Helper to send the textarea content as context
function sendContext() {
  const textarea = document.getElementById('context') as HTMLTextAreaElement | null;
  if (!textarea) return;
  const text = textarea.value;

  // Send context as a simple string document
  client.setContext({
    document: {
      type: 'text/plain',
      content: text
    }
  });
}

// Attach the button listener once the DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('send');
  if (button) {
    button.addEventListener('click', sendContext);
  }
});
