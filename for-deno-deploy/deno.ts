const html = `<!DOCTYPE html>
  <html>
    <head>
      <link href="https://raw.githubusercontent.com/iyarivky/sing-ribet-api/main/media/sing-ribet-convert.ico" rel="icon" type="image/x-icon" />
      <title>sing-ribet API</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
  
        .content {
          text-align: center;
        }
  
        h1 {
          font-family: "Source Serif 4", sans-serif;
          font-size: 4em;
          margin-bottom: 1px;
        }
        p {
          font-family: monospace;
          font-size: 1em;
          margin-top: 1px;
        }
        .fa {
          font-size: 30px;
        }
        a {
          color: black;
          text-decoration: none;
        }
        a:visited {
          color: black;
        }
        a:hover {
          color: blue;
        }
      </style>
    </head>
    <body>
      <div class="content">
        <h1>sing-ribet API</h1>
        <p>convert xray/v2ray url link to sing-box JSON.</p>
        <a href="https://github.com/iyarivky/sing-ribet-api" target="_blank">
          <i class="fa">&#xf09b;</i>
        </a>
      </div>
    </body>
  </html>`;

Deno.serve((req: Request) => new Response(html, {headers: {"content-type": "text/html;charset=UTF-8"}, status:200}));
