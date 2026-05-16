const bcrypt = require('bcryptjs');
const hash = '$2b$10$yoDqtosOHG.VC6C0g.bPkevUHbnUxrn8kwhL/wNky6TYMIQoMriQS';
bcrypt.compare('admin123', hash).then(res => console.log('Match?', res));
