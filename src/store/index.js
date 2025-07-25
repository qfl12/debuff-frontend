import { createPinia } from 'pinia';
import { useMailStore } from './modules/mail';

export const pinia = createPinia();
export { useMailStore };

export default pinia;