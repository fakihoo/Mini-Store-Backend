const logger = require('../utils/logger');

async function sendOrderConfirmation(order) {
    logger.info(`Order confirmation sent for order ${order.id}`);
}

module.exports = { sendOrderConfirmation };