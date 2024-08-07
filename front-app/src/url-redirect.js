// @ts-ignore
function handler(event) {
  console.log(JSON.stringify(event, null, 2));
  const response = event.response,
        headers = response.headers,
        header = 'x-amz-meta-location';

  if ( 
    event.request.method == 'GET' && 
    response.statusCode == 200 
    // && 
    // (
    //   (headers['transfer-encoding'] && headers['transfer-encoding'].value == 'chunked') || 
    //   (headers['content-length'] && headers['content-length'].value == '0')
    // )
  ) {
    if (headers[header] && headers[header].value) {
      headers.location = { value: headers[header].value };
      return {
        statusCode: 302,
        statusDescription: 'Found',
        headers,
      };
    }
  }
  return response;
}
