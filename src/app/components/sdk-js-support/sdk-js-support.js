angular.module('sdk-js-support', [])
    .factory('SdkSupportService', function ($window) {

        (function(){
            /*********************************
             Helper Messages
             *********************************/
            function getParameterByName(name) {
                name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
                var regexS = "[\\?&]" + name + "=([^&#]*)";
                var regex = new RegExp(regexS);
                var results = regex.exec(window.location.search);

                if (results === null) {
                    return null;
                } else {
                    return decodeURIComponent(results[1].replace(/\+/g, " "));
                }
            }

            function toParam(paramsObject) {
                var params=[];
                for(var key in paramsObject) {
                    if (paramsObject[key]) {
                        params.push(key + "=" + encodeURIComponent(paramsObject[key]));
                    }
                }
                return params.join('&');
            }

            /*********************************
             XDPost
             *********************************/
            var XDMessage = function(url, options) {
                if (typeof url === 'object') {
                    options = url;
                    url = null;
                }

                this.options        = options || {};
                this.events         = {};
                this.callbacks      = {};
                this.options.width  = this.options.width  || 720;
                this.options.height = this.options.height || 500;

                this.windowHostURL = this.options.windowHostURL || getParameterByName('opener');
                this.token         = this.options.token || getParameterByName('XDMessage_token');
                this.isChildWindow = !url;

                if (!this.isChildWindow) {
                    var opener = document.location.protocol + "//" + document.location.host;
                    this.token = ("" + Math.random()).replace('0.','');
                    this.frameURL     = url + (url.indexOf('?') === -1 ? '?' : '&') + toParam({ opener: opener, XDMessage_token: this.token });

                    this.frameHostURL = url.match(/\S+\/\/([^\/]+)/)[0];
                } else if (!this.windowHostURL) {
                    throw 'opener parameter required';
                }
            };

            XDMessage.prototype.open = function() {
                var self = this;
                this._startListening();

                if (this.frameURL) {


                    var iframe = document.createElement('iframe');
                    iframe.setAttribute('frameborder', '0');
                    iframe.src = this.frameURL;
                    iframe.style.overflow='auto';
                    iframe.style.width = "100%";
                    iframe.style.height = "100%";

                    iframe.onload = this._frameReady;

                    // Assign style
                    for (var key in (this.options.style || [])) {
                        iframe.style[key] = this.options.style[key];
                    }

                    if (this.options.target) {
                        this.options.target.appendChild(iframe);
                    } else {
                        document.body.appendChild(iframe);
                    }

                    this.iframe = iframe;

                } else {
                    this.invoke('_ready', function() {
                        self._ready();
                    });
                    this.on('_close', function(){

                    });
                }
                this.on('_ready', function(data, callback) {
                    callback();
                    self._ready();
                });
            };

            XDMessage.prototype.close = function() {
                if (this.iframe) {
                    this.iframe.parentNode.removeChild(this.iframe);
                }
                delete(this.events);
                delete(this.callbacks);
                this._stopListening();
            };

            XDMessage.prototype.on = function(event, callback) {
                if (typeof event === 'string' && typeof callback === 'function') {
                    this.events[event] = callback;
                }
            };

            XDMessage.prototype.send = function(data, callback, meta) {
                if (typeof callback === 'object') {
                    meta = callback;
                    callback = null;
                }

                var __xd_post_meta = meta || {};
                __xd_post_meta.token = this.token;

                if (callback) {
                    var random = "" + Math.random();
                    this.callbacks[random] = callback;
                    __xd_post_meta.callback = random;
                }

                var message = { __xd_post_meta: __xd_post_meta, body: data };

                this.log("Sending to" + (self.isChildWindow ? " parent " : " frame "));
                this.log(message);

                this._sendMessage(message);
            };

            XDMessage.prototype.invoke = function(method, data, callback, meta) {
                if (typeof data === 'function') {
                    callback = data;
                    data = undefined;
                }
                this.send(data, callback, { method: method });
            };

            /*********************************
             Private Methods
             *********************************/
            XDMessage.prototype._receiveMessage = function(event) {
                var allowedURL = this.isChildWindow ? this.windowHostURL : this.frameHostURL;

                if (event.origin === allowedURL) {
                    var message;

                    try {
                        message = JSON.parse(event.data);
                    } catch (ex) {
                        this.log('message data parsing failed, ignoring');
                    }

                    if (message && typeof message.__xd_post_meta !== 'undefined' && this.token === message.__xd_post_meta.token) {
                        if (typeof message.__xd_post_meta.callback_response === 'string') {
                            var callback = this.callbacks[message.__xd_post_meta.callback_response];
                            callback(message.body);
                            //delete(callback);
                        } else {
                            var method;
                            if (message.__xd_post_meta.method) {
                                if (this.events[message.__xd_post_meta.method]) {
                                    method = this.events[message.__xd_post_meta.method];
                                }
                            } else if (this.events.data) {
                                method = this.events.data;
                            }

                            if (method) {
                                if (typeof message.__xd_post_meta.callback === 'string') {
                                    var self = this;
                                    method(message.body, function(data){
                                        self.send(data, { callback_response: message.__xd_post_meta.callback });
                                    });
                                } else {
                                    method(message.body);
                                }
                            }
                        }
                    }
                }
            };

            XDMessage.prototype._sendMessage = function(data) {
                if (this.isChildWindow) {
                    window.parent.postMessage(JSON.stringify(data), this.windowHostURL);
                } else {
                    this.iframe.contentWindow.postMessage(JSON.stringify(data), this.frameHostURL);
                }
            };

            XDMessage.prototype._startListening = function() {
                var self = this;
                self.listener = function(event) {
                    self._receiveMessage(event);
                };

                if (document.addEventListener){
                    window.addEventListener('message',  self.listener, false);
                } else {
                    window.attachEvent('onmessage', self.listener);
                }
            };

            XDMessage.prototype._stopListening = function() {
                if (document.removeEventListener){
                    window.removeEventListener('message', this.listener, false);
                } else {
                    window.detachEvent('onmessage', this.listener);
                }
            };

            XDMessage.prototype._frameReady = function() {
            };

            XDMessage.prototype._ready = function() {
                if (this.events.ready) {
                    this.events.ready();
                    // delete(this.events.ready);
                }
            };

            XDMessage.prototype.log = function(message) {
                if (this.options.verbose && typeof console !== 'undefined' && typeof console.log === 'function') {
                    console.log(message);
                }
            };

            this.XDMessage = XDMessage;


        }).call(this);


        var xdm,
            sdk = $window.GlassLabSDK;

        if (sdk) {
            try {
                xdm = new this.XDMessage();

                xdm.on('api', function(params, callback){
                    params.success = function(responseData) {
                        callback({"success": responseData});
                    };
                    params.error = function(responseData) {
                        callback({"error": responseData});
                    };
                    sdk.request(params);

                });

                xdm.open();
            } catch(err) {
                // fails when not called within a client iframe, safe to ignore
            }
        }

        return {
            closeIframe: function() {
                if(xdm) {
                    xdm.invoke("close-iframe");
                }
            },
            isInJsSdkIframe: function() {
                return !!xdm;
            }
        };
    });