import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { AssocList, set_value, get_keys, get_value } from "./assoc";
import { nil, compact_list } from "./list";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

/** Contains the saved contents (of unknown type) for each file name */
let saved: AssocList<unknown> = nil;

/** Empty the map of saves, for testing purposes */
export const resetSavesForTesting = (): void => {
  saved = nil;
};

// TODO: add additional route handler functions here 
// (remove the "dummy" route, route handler, and tests when you no longer need 
// that reference)


/** 
 * Saves the given name file pair and returns a message if successful
 * @param req request to respond to
 * @param res object to send response with
 */
export const saveContent = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  const content = req.body.content;
  if (typeof(name)!=="string") {
    res.status(400).send('missing "name" parameter');
    return;
  }
  saved = set_value(name, content, saved);
  res.status(200).send(`Content saved for file: ${name}`);
}


/**
 * Load the last-saved contents of a file with a given name
 * @param req request to respond to
 * @param res object to send response with
 */
export const loadContent = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (typeof(name)!=="string") {
    res.status(400).send('missing "name" parameter');
    return;
  }
  try {
    const content = get_value(name, saved);
    res.send({name: name, content: content});
  } catch {
    res.status(404).send(`No content found for file: ${name}`);
  }
};

/**
 * List the names of all files currently saved
 * @param req request to respond to
 * @param res object to send response with
 */
export const listFiles = (_req: SafeRequest, res: SafeResponse): void => {
  const keys = compact_list(get_keys(saved));
  res.status(200).send({keys: keys});
};

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};
