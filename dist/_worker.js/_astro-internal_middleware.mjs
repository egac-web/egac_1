globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_baJFACk7.mjs';
import './chunks/astro/server_BJplAL8L.mjs';
import { s as sequence } from './chunks/index_BULiXRmT.mjs';

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	
	
);

export { onRequest };
