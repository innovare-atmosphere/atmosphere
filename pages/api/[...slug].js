// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function magic(req, res) {
  //const { slug } = req.query
  //res.status(200).json({ query: req.query, url: req.url.replace('/api/', '/') })
  let local_result = undefined;
  if (req.method == 'GET'){
    local_result = await fetch(
      `${process.env.RUNNER_URL}${req.url.replace('/api/', '/')}`,
      {
        headers: req.headers,
        method: req.method
      }
    );
  }else{
    local_result = await fetch(
      `${process.env.RUNNER_URL}${req.url.replace('/api/', '/')}`,
      {
        body: req.body,
        headers: req.headers,
        method: req.method
      }
    ); 
  }

  const result = await local_result.text();
  res.status(local_result.status).end(result);
}
