'use strict';

import xAPIMapper from "./xAPIMapper";

/**
 * @description takes in an actor (user), verb, object
 * @param object
 * @param object
 * @param object
 * @param string
 * @param string
 * @returns {Promise}
 */

export const sendStatement = (actor, verb, obj, resultExtName, resultExtValue) => {

  const statement = {
    actor: {
      account: {
        homePage: "https://ecc.gov",
        name: `${actor.first_name} ${actor.last_name}`,
      },
      objectType: "Agent"
    },
    verb: {
      id: verb.id,
      display: {
        "en-US": verb.display
      }
    },
    object: {
      id: obj.id,
      definition: {
        name: {
          "en-US": obj.definitionName
        }
      },
      objectType: "Activity"
    },
    result: {
      extensions: {
        [resultExtName]: resultExtValue
      }
    },
    timestamp: new Date().toUTCString()
  }

  obj.description && (statement['object']['definition']['description'] = {
    "en-US": obj.description
  })

  return xAPIMapper.sendStatement({ statement });
}
