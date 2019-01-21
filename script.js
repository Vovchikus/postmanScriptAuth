function getPath(url) {
    var pathRegex = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
    var result = url.match(pathRegex);
    return result && result.length > 1 ? result[1] : ''; 
}
 
function getQueryString(url) {
    var arrSplit = url.split('?');
    return arrSplit.length > 1 ? url.substring(url.indexOf('?')+1) : ''; 
}
 
function getAuthHeader(httpMethod, requestUrl, requestBody) {
    var CLIENT_KEY = 'api_key';
    var SECRET_KEY = 'api_secret';
    var AUTH_TYPE = 'HMAC-SHA256';
    var requestPath = getPath(requestUrl);
    var queryString = getQueryString(requestUrl);
    if (httpMethod == 'GET' || !requestBody || !requestBody.length) {
        requestBody = ''; 
    }
    
    var hashedPayload = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(requestBody));
    var timestamp = new Date().toISOString().split('.')[0];
    var requestData = [httpMethod, requestPath, queryString, timestamp, hashedPayload].join(" ");
    var hashedRequestData = CryptoJS.enc.Hex.stringify(CryptoJS.SHA256(requestData));
    var hmacDigest = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(hashedRequestData, SECRET_KEY));
    var authHeader = AUTH_TYPE + ', ' + timestamp + ", " + CLIENT_KEY + ', ' + hmacDigest;
    return authHeader;
}
 
postman.setEnvironmentVariable('hmacAuthHeader', getAuthHeader(request['method'], request['url'], request['data']));


