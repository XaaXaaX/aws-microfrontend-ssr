
export const enum Mfes {
  'PRODUCT_DETAILS',
  'BOOKMARKS_LIST',
  'PRODUCT_CATALOG',
}
export const Paths: Record<Mfes, string> = {
  [Mfes.PRODUCT_DETAILS]: '/api/v1/products/details/',
  [Mfes.PRODUCT_CATALOG]: '/api/v1/products/catalog/',
  [Mfes.BOOKMARKS_LIST]: '/api/v1/bookmarks/',
}

export const fetchMfe = async (MFE: Mfes, host?: string): Promise<string>  => {
  
  const hostDomain = 
    host ?? 
    process.env.REACT_APP_LOCAL_URL ?? 
    `${window.location.protocol}//${window.location.host}/`;

  let urlPath = '';
  
  if( process.env.REACT_APP_LOCAL_INVOKE_PATH )
    urlPath = urlPath.concat(process.env.REACT_APP_LOCAL_INVOKE_PATH);

  urlPath = urlPath.concat(Paths[MFE]);

  const url = new URL(urlPath, hostDomain);
  
  const queryParameters = new URLSearchParams(window.location.search);
  if(queryParameters) url.search = queryParameters.toString();

  console.log('url', url.href);

  const res = await fetch(`${url.href}`);
  return await res.text();
}