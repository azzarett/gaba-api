import { ActivationDao } from './activation.dao';
import { PromocodeDao } from './promocode.dao';

export * from './activation.dao';
export * from './promocode.dao';

export const daos = [ActivationDao, PromocodeDao];
