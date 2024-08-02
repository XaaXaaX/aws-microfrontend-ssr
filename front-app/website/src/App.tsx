import { useEffect, useState } from 'react';
import './App.css';

const Paths: Record<string, string> = {
  'BOOKMARKS_LIST': 'bookmarks/v1/',
  'PRODUCT_CATALOG': 'products/catalog/v1/',
}

const fetchMfe = async (MFE: string, host?: string): Promise<string>  => {
  
  const hostDomain = 
    host ?? 
    process.env.REACT_APP_LOCAL_URL ?? 
    `${window.location.protocol}//${window.location.host}/`;
    
  const url = new URL(Paths[MFE], hostDomain);

  const queryParameters = new URLSearchParams(window.location.search);
  if(queryParameters) url.search = queryParameters.toString();

  const res = await fetch(`${url.href}`);
  return await res.text();
}

function App() {
  const [bookmarks, setBookmarks] = useState('');
  const [catalog, setCatalog] = useState('');

  useEffect(() => {
    async function RenderMFEs() {
      const promiseProcessSuccess = 'fulfilled';
      await Promise.allSettled([
        fetchMfe("BOOKMARKS_LIST"),
        fetchMfe("PRODUCT_CATALOG"),
      ]).then((results) => {
        results.forEach((result) => {
          if (result.status === 'rejected') console.error('HP error :', result.reason) });
        if (results[0].status === promiseProcessSuccess) setBookmarks(results[0].value);
        if (results[1].status === promiseProcessSuccess) setCatalog(results[1].value);

      });
    };

    if (!bookmarks || !catalog) 
      RenderMFEs();

  }, [bookmarks, catalog]);

  return (
    <div className="App">
        <header className="App-header">
          <h1>Welcome to MFE example Site!</h1>
        </header> 
        <div className="App-body">
            <div dangerouslySetInnerHTML={{ __html: bookmarks }} />
            <div dangerouslySetInnerHTML={{ __html: catalog }} />
        </div>
    </div>
  );
}

export default App;
