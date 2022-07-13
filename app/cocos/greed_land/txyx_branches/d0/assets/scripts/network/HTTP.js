var HTTP = cc.Class({
    extends: cc.Component,

    statics: {
        sendRequest: function (method, url, data, handler, errorHandler) {
            let xhr = cc.loader.getXMLHttpRequest();
            let timeout = false;
            let timer = setTimeout(function () {
                timeout = true;
                xhr.abort();
                if(errorHandler != null) {
                    errorHandler();
                }
            }, 5000);
            xhr.timeout = 5000;
            let str = '';
            if (method != 'POST') {
                for (var k in data) {
                    if (str == '') {
                        str += '?';
                    } else {
                        str += '&';
                    }
                    
                    str += k + "=" + data[k];
                }
            }
            let requestURL = url + encodeURI(str);
            cc.log("RequestURL:" + requestURL);
            xhr.open(method, requestURL, true);
            if(method == 'POST') {
                xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");
                //xhr.setRequestHeader("Content-Type", "application/json;");
            }
            if (cc.sys.isNative) {
                xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if(timeout) {
                        return;
                    }
                    clearTimeout(timer);
                    if(xhr.status >= 200 && xhr.status < 300){
                        cc.log('http res(' + xhr.responseText.length + '):' + xhr.responseText);
                        try {
                            let ret = JSON.parse(xhr.responseText);
                            if (handler != null) {
                                handler(ret);
                            }
                        } catch (e) {
                            cc.log('err:' + e);
                            if(errorHandler != null) {
                                errorHandler();
                            }
                        }
                        finally {

                        }
                    }
                    else{
                       if(errorHandler != null) {
                           errorHandler();
                       }
                    }

                }
            }

            if (method != 'POST') {
                xhr.send();
            } else {
                let body = JSON.stringify(data);
                xhr.send(body);
            }
            
            return xhr;
        },
    },
});
