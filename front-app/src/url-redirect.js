// @ts-ignore
function handler(event) {
  const header = 'x-amz-meta-location';

  const { request, response, response: { headers } } = event;

  if ( 
    'GET' == request.method &&  
    200 == response.statusCode && 
    headers[header] && 
    headers[header].value
  ) {
      headers.location = { value: headers[header].value };
      return {
        statusCode: 302,
        statusDescription: 'Found',
        headers,
      };
  }
  return response;
}
