import { useEffect, useState } from 'react';
import '../../App.css';
import { Mfes, fetchMfe,  } from '../../helpers/mfe-helper';

function App() {
  const [bookmarks, setBookmarks] = useState('');
  const [catalog, setCatalog] = useState('');

  useEffect(() => {
    async function RenderMFEs() {
      const promiseProcessSuccess = 'fulfilled';
      await Promise.allSettled([
        fetchMfe(Mfes.BOOKMARKS_LIST),
        fetchMfe(Mfes.PRODUCT_CATALOG),
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
