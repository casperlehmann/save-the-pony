const handlingResponse = (response) => {
  if (response.ok) {
    return response;
  } else {
    console.log('Error:', response.statusText);
  }
}

export function httpPost(url, payload, callback)
{
    fetch(url,  {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(handlingResponse)
    .then((res) => res.json())
    .then(function(data){callback(data)})
    .catch(error => console.log(error));
}

export function httpGet(url, callback)
{
    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(handlingResponse)
    .then((res) => res.json())
    .then(function(data){callback(data)})
    .catch(error => console.log(error));
}