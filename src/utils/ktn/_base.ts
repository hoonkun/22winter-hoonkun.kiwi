export const definePropertyIfNotExists = (obj: any, p:  PropertyKey, attributes: PropertyDescriptor & ThisType<any>) => {
  if (obj.hasOwnProperty(p)) return;
  Object.defineProperty(obj, p, attributes);
}
