import * as uuid from "uuid";

export function makeId(id: string|null|undefined): string {
  return id ?? uuid.v4();
}
