export function httpPost(url, payload, callback)
{
    fetch(url,  {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then((res) => res.json())
    .then(function(data){
      callback(data)
    });
}

export function httpGet(url, callback)
{
    fetch(url, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json())
    .then(function(data){
      callback(data)
    });
}