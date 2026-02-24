'use strict';

import { sendStatement } from './xAPIWrapper';

/**
 * Sends a statement to the LRS based on the context provided.
 * @param {{
 * actor:{first_name:string, last_name:string},
 * verb:{id:string, display:string},
 * object:{id?:string, definitionName:string, description?:string},
 * resultExtName:string,
 * resultExtValue:string,
 * }} context
 * @returns
 */

export function xAPISendStatement(context) {
  // verify there is a user object
  if (!context.actor) return console.error('no user object');

  // verify the required fields are present
  if (!context.verb) return console.error('no verb object');

  if (!context.object) return console.error('no object object');

  if (!context.resultExtName) return console.error('no resultExtName');

  if (!context.resultExtValue) return console.error('no resultExtValue');

  // get the window
  const windowLocation = globalThis.location.href;

  // if the object has an id, use it otherwise populate it with the window location
  if (!context.object?.id) context.object.id = windowLocation;

  sendStatement(
    context.actor,
    context.verb,
    context.object,
    context.resultExtName,
    context.resultExtValue
  );
}
