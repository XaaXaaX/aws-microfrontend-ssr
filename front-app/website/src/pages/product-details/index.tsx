import { useEffect, useState } from 'react';
import '../../App.css';
import { Mfes, fetchMfe,  } from '../../helpers/mfe-helper';
function App() {
  const [product, setProduct] = useState('');

  useEffect(() => {
    async function RenderMFEs() {
      const promiseProcessSuccess = 'fulfilled';
      await Promise.allSettled([
        fetchMfe(Mfes.PRODUCT_DETAILS),
      ]).then((results) => {
        results.forEach((result) => {
          if (result.status === 'rejected') console.error('HP error :', result.reason) });
        if (results[0].status === promiseProcessSuccess) setProduct(results[0].value);

      });
    };

    if (!product) 
      RenderMFEs();

  }, [product]);

  return (
    <div className="App">
        <header className="App-header">
          <h1>Welcome to MFE example Site!</h1>
        </header> 
        <div className="App-body">
            <div dangerouslySetInnerHTML={{ __html: product }} />
        </div>
    </div>
  );
}

export default App;
