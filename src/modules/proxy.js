require("colors");


// Debugging
class ProxyClient {
    constructor(client, { errorLogger = console.error, eventLogger = console.log }) {
        this.proxy = new Proxy(client, {
            get: (target, prop, receiver) => {
                const original = Reflect.get(target, prop, receiver);
                if (typeof original === 'function') {
                    return function (...args) {
                        eventLogger(`Calling ${prop} with args:`, args);
                        try {
                            return original.apply(this, args);
                        } catch (error) {
                            errorLogger(`Error in ${prop}:`, error);
                            throw error;
                        }
                    }; 
                }
                return original;
            }
        });

        this.errorLogger = errorLogger;
        this.eventLogger = eventLogger;
    }

    init() {
        return new Promise((resolve, reject) => {
            if (this.proxy.ready) {
                this.eventLogger('[PROXY] Client is already ready');
                resolve();
                return;
            }

            this.proxy.on('ready', () => {
                this.eventLogger('[PROXY] Client is ready');
                resolve();
            });
        });
    }

    err(error) {
        if (error instanceof Error) {
            this.errorLogger(`[PROXY MSG] ${error.message}`);
            this.errorLogger(`[PROXY TRACE] ${error.stack}`);
        } else {
            this.errorLogger(`[PROXY - NON ERR OBJ RECEIVED] ${error}`);
        }
    }
}