globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_2halvpyk.mjs';
import './chunks/astro/server_BcA0Y13i.mjs';
import { s as sequence } from './chunks/index_BAtTXxFJ.mjs';

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
