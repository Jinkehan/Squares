import { List, nil, cons, concat } from "./list";


/** 
 * An association list is a list of key-value pairs, where keys are strings 
 * Inv: all keys must be unique
 */
export type AssocList<V> = List<[string, V]>;


/**
 * Creates a new AssocList containing the pairs from the given list
 * plus the new pair: (key, value). 
 * Replaces any existing pair with given key.
 * 
 * @param key to update the value of
 * @param value to set for the given key
 * @param L list to add updated (key, value) pair to to create output list
 * @returns set-value(key, value, L), where 
 *  set-value: (S*, V, AssocList<V>) -> AssocList<V>
 *      set-value(k, v, nil)          := (k, v) :: nil
 *      set-value(k, v, (x, y) :: R)  := ((k, v) :: nil) ++ R          if k = x
 *      set-value(k, v, (x, y) :: R)  := (x, y) :: set-value(k, v, R)  if k /= x
 */
export const set_value = <V> (key: string, value: V, L: AssocList<V>): AssocList<V> => {
  if (L.kind === "nil") {
    return cons([key, value], nil);
  } else {
    const [x, _y]: [string, V] = L.hd;
    if (key === x) {
      return concat(cons([key, value], nil), L.tl);
    } else {
      return cons(L.hd, set_value(key, value, L.tl));
    }
  }
  // Note: Notice that this implementation differs from the version we went
  // over in lecture where existing pairs with the given key to set the 
  // value of were NOT removed
  //
  // It is important in this implementation that set_value is ALWAYS used to
  // add new pairs to the list, otherwise the rule that all keys in the list
  // must be unique could break. Avoid hard debugging!
};


/**
 * Determines if the given key is within a pair in the given list
 * @param x key to determine if list contains
 * @param L list to determine if key is contained in
 * @returns contains-key(x, L), where 
 *  contains-key: (S*, AssocList<V>) -> B
 *      contains-key(x, nil)          := false
 *      contains-key(x, (y, v) :: R)  := true                if x = y
 *      contains-key(x, (y, v) :: R)  := contains-key(x, R)  if x /= y
 */
export const contains_key = <V> (x: string, L: AssocList<V>): boolean => {
  if (L.kind === "nil") {
    return false;
  } else {
    const [y, _v]: [string, V] = L.hd;
    if (x === y) {
      return true;
    } else {
      return contains_key(x, L.tl);
    }
  }
};


/**
 * Gets set of keys in the given list
 * @param L list in question
 * @returns get-keys(L), where
 *  get-keys: AssocList<V> -> List<S*>
 *      get-keys(nil)          := nil
 *      get-keys((y, v) :: R)  := y :: get-keys(R)
 */
export const get_keys = <V> (L: AssocList<V>): List<string> => {
  if (L.kind === "nil") {
    return nil;
  } else  {
    const [y, _v]: [string, V] = L.hd;
    return cons(y, get_keys(L.tl));
  }
};


/**
 * Gets the value paired with the first instance of the given key 
 * in the given list
 * @param x key to find the corresponding value for
 * @param L list to find x's value pair in
 * @returns get-value(x, L), where
 *  get-value: (S*, AssocList<V>) -> V
 *      get-value(x, (y, v) :: R)  := v                if x = y
 *      get-value(x, (y, v) :: R)  := get-value(x, R)  if x /= y
 *  (get-value is only defined on AssocLists, L, where contains-key(x, L))
 * @throws Error when contains-key(x, L) = false
 */
export const get_value = <V> (x: string, L: AssocList<V>): V => {
  if (L.kind === "nil") {
    throw new Error("key is not contained in Map");
  } else  {
    const [y, v]: [string, V] = L.hd;
    if (x === y) {
      return v;
    } else {
      return get_value(x, L.tl);
    }
  }
};
