import React, { useEffect, useState } from 'react';
import './App.css';

const Paths: Record<string, string> = {
  'BOOKMARKS_LIST': 'bookmarks/v1/',
  'PRODUCT_CATALOG_LIST': 'product/catalog/v1/',
}


const fetchMfe = async (service: string, MFE: string): Promise<string>  => {
  const queryParameters = new URLSearchParams(window.location.search)
  const url = new URL(Paths[MFE], `${window.location.protocol}//${window.location.host}/`);

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
        fetchMfe("BOOK_MARKS", "BOOKMARKS_LIST"),
        fetchMfe("PRODUCT_CATALOG", "PRODUCT_CATALOG_LIST")
      ]).then((results) => {
        results.forEach((result) => {
          if (result.status === 'rejected') console.error('HP error :', result.reason) });
        if (results[0].status === promiseProcessSuccess) setBookmarks(results[0].value);
        if (results[1].status === promiseProcessSuccess) setCatalog(results[1].value);
      });
    };

    if (!bookmarks || !catalog) RenderMFEs();

  }, [bookmarks, catalog]);

  return (
    <div className="App">
        <h1>Welcome to MFE SSR Based Site!</h1>
        <header className="App-header">
          <div dangerouslySetInnerHTML={{ __html: bookmarks }} />
          <div dangerouslySetInnerHTML={{ __html: catalog }} />      
      </header> 
    </div>
  );
}

export default App;
