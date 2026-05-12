/**
 * Injection token dùng để inject RabbitMQ ClientProxy vào service.
 * Phải khớp với name trong ClientsModule.register().
 */
export const MATCHING_ENGINE_SERVICE = 'MATCHING_ENGINE_SERVICE';

export const DEFAULT_MATCHING_QUEUE = 'matching.order.created';
