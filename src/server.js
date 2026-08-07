const config = require('./config/env');
const app = require('./app');
const logger = require('./utils/logger');

app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
});