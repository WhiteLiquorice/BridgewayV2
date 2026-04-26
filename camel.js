const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'dataconnect', 'schema', 'schema.gql');
let content = fs.readFileSync(schemaPath, 'utf8');

// Replace snake_case with camelCase only in field names
content = content.replace(/^(\s+)([a-z0-9_]+):/gm, (match, spaces, field) => {
    const camel = field.replace(/_([a-z0-9])/g, (m, letter) => letter.toUpperCase());
    return spaces + camel + ':';
});

fs.writeFileSync(schemaPath, content);
