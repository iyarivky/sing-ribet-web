var version = "3.7.5";
var VERSION = version;
var _hasatob = typeof atob === "function";
var _hasbtoa = typeof btoa === "function";
var _hasBuffer = typeof Buffer === "function";
var _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
var _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
var b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var b64chs = Array.prototype.slice.call(b64ch);
var b64tab = ((a) => {
  let tab = {};
  a.forEach((c, i) => tab[c] = i);
  return tab;
})(b64chs);
var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
var _fromCC = String.fromCharCode.bind(String);
var _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
var _mkUriSafe = (src) => src.replace(/=/g, "").replace(/[+\/]/g, (m0) => m0 == "+" ? "-" : "_");
var _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, "");
var btoaPolyfill = (bin) => {
  let u32, c0, c1, c2, asc = "";
  const pad = bin.length % 3;
  for (let i = 0; i < bin.length;) {
    if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
      throw new TypeError("invalid character found");
    u32 = c0 << 16 | c1 << 8 | c2;
    asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
  }
  return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
};
var _btoa = _hasbtoa ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
var _fromUint8Array = _hasBuffer ? (u8a) => Buffer.from(u8a).toString("base64") : (u8a) => {
  const maxargs = 4096;
  let strs = [];
  for (let i = 0, l = u8a.length; i < l; i += maxargs) {
    strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
  }
  return _btoa(strs.join(""));
};
var fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
var cb_utob = (c) => {
  if (c.length < 2) {
    var cc = c.charCodeAt(0);
    return cc < 128 ? c : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
  } else {
    var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320);
    return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
  }
};
var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
var utob = (u) => u.replace(re_utob, cb_utob);
var _encode = _hasBuffer ? (s) => Buffer.from(s, "utf8").toString("base64") : _TE ? (s) => _fromUint8Array(_TE.encode(s)) : (s) => _btoa(utob(s));
var encode = (src, urlsafe = false) => urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);
var encodeURI = (src) => encode(src, true);
var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
var cb_btou = (cccc) => {
  switch (cccc.length) {
    case 4:
      var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3),
        offset = cp - 65536;
      return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
    case 3:
      return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
    default:
      return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
  }
};
var btou = (b) => b.replace(re_btou, cb_btou);
var atobPolyfill = (asc) => {
  asc = asc.replace(/\s+/g, "");
  if (!b64re.test(asc))
    throw new TypeError("malformed base64.");
  asc += "==".slice(2 - (asc.length & 3));
  let u24, bin = "",
    r1, r2;
  for (let i = 0; i < asc.length;) {
    u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
    bin += r1 === 64 ? _fromCC(u24 >> 16 & 255) : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255) : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
  }
  return bin;
};
var _atob = _hasatob ? (asc) => atob(_tidyB64(asc)) : _hasBuffer ? (asc) => Buffer.from(asc, "base64").toString("binary") : atobPolyfill;
var _toUint8Array = _hasBuffer ? (a) => _U8Afrom(Buffer.from(a, "base64")) : (a) => _U8Afrom(_atob(a).split("").map((c) => c.charCodeAt(0)));
var toUint8Array = (a) => _toUint8Array(_unURI(a));
var _decode = _hasBuffer ? (a) => Buffer.from(a, "base64").toString("utf8") : _TD ? (a) => _TD.decode(_toUint8Array(a)) : (a) => btou(_atob(a));
var _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == "-" ? "+" : "/"));
var decode = (src) => _decode(_unURI(src));
var isValid = (src) => {
  if (typeof src !== "string")
    return false;
  const s = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
  return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
};
var _noEnum = (v) => {
  return {
    value: v,
    enumerable: false,
    writable: true,
    configurable: true
  };
};
var extendString = function() {
  const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
  _add("fromBase64", function() {
    return decode(this);
  });
  _add("toBase64", function(urlsafe) {
    return encode(this, urlsafe);
  });
  _add("toBase64URI", function() {
    return encode(this, true);
  });
  _add("toBase64URL", function() {
    return encode(this, true);
  });
  _add("toUint8Array", function() {
    return toUint8Array(this);
  });
};
var extendUint8Array = function() {
  const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
  _add("toBase64", function(urlsafe) {
    return fromUint8Array(this, urlsafe);
  });
  _add("toBase64URI", function() {
    return fromUint8Array(this, true);
  });
  _add("toBase64URL", function() {
    return fromUint8Array(this, true);
  });
};
var extendBuiltins = () => {
  extendString();
  extendUint8Array();
};
var gBase64 = {
  version,
  VERSION,
  atob: _atob,
  atobPolyfill,
  btoa: _btoa,
  btoaPolyfill,
  fromBase64: decode,
  toBase64: encode,
  encode,
  encodeURI,
  encodeURL: encodeURI,
  utob,
  btou,
  decode,
  isValid,
  fromUint8Array,
  toUint8Array,
  extendString,
  extendUint8Array,
  extendBuiltins
};

// test.js
async function v2rayToSing(v2rayAccount) {
  let v2rayArrayUrl = v2rayAccount.split("\n");
  // let ftpArrayUrl = v2rayArrayUrl.map((urlString) => urlString.replace(/^[^:]+(?=:\/\/)/, "ftp"));
  let ftpArrayUrl = v2rayArrayUrl.map((urlString) => {
    if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
        return urlString.replace(/^[^:]+(?=:\/\/)/, "ftp");
    } else {
        return urlString;
    }
  });

  let resultParse = [];

  function parseVmessUrl(ftpArrayUrl2) {
    let ftpParsedUrl = ftpArrayUrl2.substring(6);
    let decodeResult = gBase64.decode(ftpParsedUrl);
    let parsedJSON = JSON.parse(decodeResult);
    const configResult = {
      tag: parsedJSON.ps || parsedJSON.add,
      type: "vmess",
      server: parsedJSON.add,
      server_port: ~~parsedJSON.port,
      uuid: parsedJSON.id,
      security: "auto",
      alter_id: ~~parsedJSON.aid,
      global_padding: false,
      authenticated_length: true,
      multiplex: {
        enabled: false,
        protocol: "smux",
        max_streams: 32
      }
    };
    if (parsedJSON.port === "443" || parsedJSON.tls === "tls") {
      configResult.tls = {
        enabled: true,
        server_name: parsedJSON.sni || parsedJSON.add,
        insecure: true,
        disable_sni: false
      };
    }
    if (parsedJSON.net === "ws") {
      configResult.transport = {
        type: parsedJSON.net,
        path: parsedJSON.path,
        headers: {
          Host: parsedJSON.host || parsedJSON.add
        },
        max_early_data: 0,
        early_data_header_name: "Sec-WebSocket-Protocol"
      };
    } else if (parsedJSON.net === "grpc") {
      configResult.transport = {
        type: parsedJSON.net,
        service_name: parsedJSON.path,
        idle_timeout: "15s",
        ping_timeout: "15s",
        permit_without_stream: false
      };
    }
    return configResult;
  }

  function parseVlessUrl(ftpArrayUrl2) {
    let ftpParsedUrl = new URL(ftpArrayUrl2);
    const configResult = {
      tag: ftpParsedUrl.hash.substring(1) || ftpParsedUrl.hostname,
      type: "vless",
      server: ftpParsedUrl.hostname,
      server_port: ~~ftpParsedUrl.port,
      uuid: ftpParsedUrl.username,
      flow: "",
      packet_encoding: "xudp",
      multiplex: {
        enabled: false,
        protocol: "smux",
        max_streams: 32
      }
    };
    if (ftpParsedUrl.port === "443" || ftpParsedUrl.searchParams.get("security") === "tls") {
      configResult.tls = {
        enabled: true,
        server_name: ftpParsedUrl.searchParams.get("sni"),
        insecure: true,
        disable_sni: false
      };
    }
    const transportTypes = {
      ws: {
        type: ftpParsedUrl.searchParams.get("type"),
        path: ftpParsedUrl.searchParams.get("path"),
        headers: {
          Host: ftpParsedUrl.searchParams.get("host")
        },
        max_early_data: 0,
        early_data_header_name: "Sec-WebSocket-Protocol"
      },
      grpc: {
        type: ftpParsedUrl.searchParams.get("type"),
        service_name: ftpParsedUrl.searchParams.get("serviceName"),
        idle_timeout: "15s",
        ping_timeout: "15s",
        permit_without_stream: false
      }
    };
    configResult.transport = transportTypes[ftpParsedUrl.searchParams.get("type")];
    return configResult;
  }

  function parseTrojanUrl(ftpArrayUrl2) {
    let ftpParsedUrl = new URL(ftpArrayUrl2);
    const configResult = {
      tag: ftpParsedUrl.hash.substring(1) || ftpParsedUrl.hostname,
      type: "trojan",
      server: ftpParsedUrl.hostname,
      server_port: ~~ftpParsedUrl.port,
      password: ftpParsedUrl.username,
      multiplex: {
        enabled: false,
        protocol: "smux",
        max_streams: 32
      }
    };
    if (ftpParsedUrl.port === "443" || ftpParsedUrl.searchParams.get("security") === "tls") {
      configResult.tls = {
        enabled: true,
        server_name: ftpParsedUrl.searchParams.get("sni"),
        insecure: true,
        disable_sni: false
      };
    }
    const transportTypes = {
      ws: {
        type: ftpParsedUrl.searchParams.get("type"),
        path: ftpParsedUrl.searchParams.get("path"),
        headers: {
          Host: ftpParsedUrl.searchParams.get("host")
        },
        max_early_data: 0,
        early_data_header_name: "Sec-WebSocket-Protocol"
      },
      grpc: {
        type: ftpParsedUrl.searchParams.get("type"),
        service_name: ftpParsedUrl.searchParams.get("serviceName"),
        idle_timeout: "15s",
        ping_timeout: "15s",
        permit_without_stream: false
      }
    };
    configResult.transport = transportTypes[ftpParsedUrl.searchParams.get("type")];
    return configResult;
  }

  function parseShadowsocksUrl(ftpArrayUrl2) {
    let ftpParsedUrl = new URL(ftpArrayUrl2);
    let encoded = decodeURIComponent(ftpParsedUrl.username);
    let decodeResult = atob(encoded);
    let shadowsocksPart = decodeResult.split(":");
    const configResult = {
      tag: ftpParsedUrl.hash.substring(1) || ftpParsedUrl.hostname,
      type: "shadowsocks",
      server: ftpParsedUrl.hostname,
      server_port: ~~ftpParsedUrl.port,
      method: shadowsocksPart[0],
      password: shadowsocksPart[1],
      plugin: "",
      plugin_opts: ""
    };
    return configResult;
  }

  function parseShadowsocksRUrl(ftpArrayUrl2) {
    let ftpParsedUrl = ftpArrayUrl2.substring(6);
    let decodeResult = gBase64.decode(ftpParsedUrl);
    let [serverSSR, portSSR, protocolSSR, methodSSR, obfsSSR, passwordSSR] = decodeResult.split(":");
    let params = new URLSearchParams(decodeResult.split("?")[1]);
    let obfs_paramSSR = params.get("obfsparam");
    let tagSSR = params.get("remarks");
    let proto_paramSSR = params.get("protoparam");
    const configResult = {
      tag: gBase64.decode(tagSSR),
      type: "shadowsocksr",
      server: serverSSR,
      server_port: ~~portSSR,
      method: methodSSR,
      password: atob(passwordSSR.split("/")[0]),
      obfs: obfsSSR,
      obfs_param: atob(obfs_paramSSR),
      protocol: protocolSSR,
      protocol_param: atob(proto_paramSSR)
    };
    return configResult;
  }

  function parseSocksUrl(ftpArrayUrl2) {
    let ftpParsedUrl = new URL(ftpArrayUrl2);
    const configResult = {
      tag: ftpParsedUrl.hash.substring(1) || ftpParsedUrl.hostname,
      type: "socks",
      server: ftpParsedUrl.hostname,
      server_port: ~~ftpParsedUrl.port,
      password: ftpParsedUrl.username,
      version: "5"
    };
    return configResult;
  }

  function parseHttpUrl(ftpArrayUrl2) {
    let ftpParsedUrl = new URL(ftpArrayUrl2);
    const configResult = {
      tag: ftpParsedUrl.hash.substring(1) || ftpParsedUrl.hostname,
      type: "http",
      server: ftpParsedUrl.hostname,
      server_port: ~~ftpParsedUrl.port,
      password: ftpParsedUrl.username
    };
    if (ftpParsedUrl.protocol === "https:") {
      configResult.tls = {
        enabled: true,
        insecure: true
      };
      if (ftpParsedUrl.searchParams.get("sni")){
        configResult.tls.server_name = ftpParsedUrl.searchParams.get("sni")
      }
    }
    return configResult;
  }
  const protocolMap = {
    "vmess:": parseVmessUrl,
    "vless:": parseVlessUrl,
    "trojan:": parseTrojanUrl,
    "trojan-go:": parseTrojanUrl,
    "ss:": parseShadowsocksUrl,
    "ssr:": parseShadowsocksRUrl,
    "socks5:": parseSocksUrl,
    "http:": parseHttpUrl,
    "https:": parseHttpUrl
  };
  let v2rayLength = v2rayArrayUrl.length;
  for (let i = 0; i < v2rayLength; i++) {
    let v2rayParsedUrl = new URL(v2rayArrayUrl[i]);
    let configResult;
    const protocolHandler = protocolMap[v2rayParsedUrl.protocol];
    if (protocolHandler) {
      configResult = protocolHandler(ftpArrayUrl[i]);
    } else {
      console.log("Unsupported Protocol!");
    }
    const resultLength = resultParse.length;
    resultParse[resultLength] = configResult;
  }
  return resultParse;
}

async function fetchConfig(url) {
  const response = await fetch(url);
  return await response.json();
}

function pasteConfig(outputId) {
  let def = SnackBar({
    message: "Successfully copied to clipboard.",
    position: "bc",
    fixed: true,
    status: "success"
  });
  var copyText = document.getElementById(outputId);
  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices
  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);
}

//parseUrl button
async function parseUrl() {
  let wait = SnackBar({
    message: "Please Wait.",
    position: "bc",
    fixed: true,
    status: "success"
  });
  let inputText = document.getElementById("input").value;
  let convertAccount = await v2rayToSing(decodeURIComponent(inputText));
  const outboundsConfig = convertAccount.map((item) => item);
  outboundsConfig.forEach((item) => {
    item.domain_strategy = "ipv4_only";
  });
  let tagCount = {};
  let nameProxy = outboundsConfig.map((item) => {
    let tag = item.tag;
    if (tag in tagCount) {
      tagCount[tag]++;
      return tag + " " + tagCount[tag];
    } else {
      tagCount[tag] = 1;
      return tag;
    }
  });
  outboundsConfig.forEach((item, index) => {
    item.tag = nameProxy[index];
  });
  const urls = {
    sfa: "https://raw.githubusercontent.com/iyarivky/sing-ribet/main/config/config.json",
    sfaSimple: "https://raw.githubusercontent.com/iyarivky/sing-ribet/main/config/config-simple.json",
    bfm: "https://raw.githubusercontent.com/iyarivky/sing-ribet/main/config/config-bfm.json",
    bfmSimple: "https://raw.githubusercontent.com/iyarivky/sing-ribet/main/config/config-bfm-simple.json"
  };
  const configs = {};
  for (const [key, url2] of Object.entries(urls)) {
    configs[key] = await fetchConfig(url2);
  }
  const configNames = ["sfa", "sfaSimple", "bfm", "bfmSimple"];
  const tags = {
    sfa: ["Internet", "Best Latency", "Lock Region ID"],
    sfaSimple: ["Internet", "Best Latency"],
    bfm: ["Internet", "Best Latency", "Lock Region ID"],
    bfmSimple: ["Internet", "Best Latency"]
  };
  const findIndexTag = {
    sfa: "Lock Region ID",
    sfaSimple: "Best Latency",
    bfm: "Lock Region ID",
    bfmSimple: "Best Latency"
  };
  for (const name of configNames) {
    const config = configs[name];
    config.outbounds.forEach((outbound) => {
      if (tags[name].includes(outbound.tag)) {
        outbound.outbounds.push(...nameProxy);
      }
    });
    let addProxy = config.outbounds.findIndex(
      (outbound) => outbound.tag === findIndexTag[name]
    );
    config.outbounds.splice(addProxy + 1, 0, ...outboundsConfig);
  }
  let formattedConfigSFA = JSON.stringify(configs["sfa"], null, 2);
  let formattedConfigSFASimple = JSON.stringify(configs["sfaSimple"], null, 2);
  let formattedConfigBFM = JSON.stringify(configs["bfm"], null, 2);
  let formattedConfigBFMSimple = JSON.stringify(configs["bfmSimple"], null, 2);
  document.getElementById("output1").value = formattedConfigSFA;
  document.getElementById("output2").value = formattedConfigSFASimple;
  document.getElementById("output3").value = formattedConfigBFM;
  document.getElementById("output4").value = formattedConfigBFMSimple;
  let succ = SnackBar({
    message: "Convert Success.",
    position: "bc",
    fixed: true,
    status: "success"
  });
}

function downloadConfig(outputId){
  let listNameConfig = {
    "output1" : "sfa",
    "output2" : "sfaSimple",
    "output3" : "bfm",
    "output4" : "bfmSimple"
  }
  let nameConfig = listNameConfig[outputId]
  let outputText = document.getElementById(outputId).value;
  let blob = new Blob([outputText], {type: "text/plain;charset=utf-8"});
  let date = new Date();
  let dateString = date.toLocaleDateString('id-ID').replace(/\//g, '-');
  let timeString = date.toLocaleTimeString('id-ID');
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = `${nameConfig}-${dateString}-${timeString}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
