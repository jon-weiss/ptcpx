
var rt_get = (urlPath) => { return ajax_get(rtUrl(urlPath)); };
var ajax_get = function (url) {

    var ajaxOptions = {
        cache: false,
        url: url,
        contentType: "application/json; charset=utf-8",
    };

    return $.ajax(ajaxOptions)
        .done(function (results) {
            if (results.hasOwnProperty('value') && results.hasOwnProperty('msg') && results.value < 0) {
                new Noty({
                    type: 'error', layout: 'bottomRight', timeout: 3000,
                    text: new fstr("{0}").format([results.msg])
                }).show();
            }
        })
        .fail(function (xhr, type, msg) {
            if (type == 'error') {
                if (xhr.status == 500) {
                    new Noty({
                        type: 'error', layout: 'bottomRight', timeout: 3000,
                        text: new fstr("** SERVER ERROR **\n({0})").format([xhr.status + ":" + xhr.statusText])
                    }).show();
                }
                else {
                    var response = JSON.parse(xhr.responseText);
                    var request = urlPath.substr(0, urlPath.indexOf("?"));
                    // noty({ text: "** AJAX ERROR **\n[{2}]\n{1}\n({0})".format([xhr.status + ":" + xhr.statusText, response.ExceptionMessage, request]), type: 'error' });
                    new Noty({
                        type: 'error', layout: 'bottomRight', timeout: 3000,
                        text: new fstr("** AJAX ERROR **\n[{2}]\n{1}\n({0})").format([xhr.status + ":" + xhr.statusText, response.ExceptionMessage, request])
                    }).show();
                }
            }
        })
        .always(function () {
        });
};

var rt_post = (urlPath, jsonDataParams) => { return ajax_post(rtUrl(urlPath), jsonDataParams); };
var ajax_post = function (urlPath, jsonDataParams) {
    var dataParams = '{}';
    if (typeof jsonDataParams == 'object') {
        dataParams = JSON.stringify(jsonDataParams);
    }
    if (typeof jsonDataParams == 'string') {
        dataParams = jsonDataParams;
    }

    var ajaxOptions = {
        cache: false,
        type: "POST",
        url: urlPath,
        contentType: "application/json; charset=utf-8",
    };

    if (!(typeof jsonDataParams == 'undefined' || typeof jsonDataParams == 'null')) {
        var ajaxOptions = $.extend(ajaxOptions, { data: dataParams });
    }

    return $.ajax(ajaxOptions)
        .done(function (results) {
            if (results.hasOwnProperty('value') && results.hasOwnProperty('msg') && results.value < 0) {
                new Noty({
                    type: 'error', layout: 'bottomRight', timeout: 3000,
                    text: new fstr("{0}").format([results.msg])
                }).show();
            }
        })
        .fail(function (xhr, type, msg) {
            if (type == 'error') {
                if (xhr.status == 500) {
                    new Noty({
                        type: 'error', layout: 'bottomRight', timeout: 3000,
                        text: new fstr("** SERVER ERROR **\n({0})").format([xhr.status + ":" + xhr.statusText])
                    }).show();
                }
                else {
                    var response = JSON.parse(xhr.responseText);
                    var request = urlPath.substr(0, urlPath.indexOf("?"));
                    // noty({ text: "** AJAX ERROR **\n[{2}]\n{1}\n({0})".format([xhr.status + ":" + xhr.statusText, response.ExceptionMessage, request]), type: 'error' });
                    new Noty({
                        type: 'error', layout: 'bottomRight', timeout: 3000,
                        text: new fstr("** AJAX ERROR **\n[{2}]\n{1}\n({0})").format([xhr.status + ":" + xhr.statusText, response.ExceptionMessage, request])
                    }).show();
                }
            }
        })
        .always(function () {
        });
};

var rtUrl = function (remoteRequestPath, paramObj) {
    var paramlist = $.extend({}, paramObj);
    var r = new fstr('proxy?rt={0}').format([remoteRequestPath]);
    for (let o of Object.keys(paramlist)) {
        if (o === _type) { continue; }
        r += ((r.length > 0) ? '&' : '') + o + '=' + paramlist[o];
    }
    return r;
};


