export default {
    async delete(url, paramaters) {
        url = this.appendParams(url, paramaters);

        return await new Http({ url, method: 'DELETE' }).execute();
    },

    async get(url, paramaters) {
        url = this.appendParams(url, paramaters);

        return await new Http({ url, method: 'GET' }).execute();
    },

    async put(url, body) {
        return await new Http({ url, method: 'PUT' }).execute(body);
    },

    async post(url, body) {
        return await new Http({ url, method: 'POST' }).execute(body);
    },

    appendParams(url, paramaters) {
        if (!paramaters) return url;

        return Object.entries(paramaters).reduce((url, [key, value]) => {
            return `${url}${key}=${encodeURIComponent(value)}`;
        }, url + '?');
    },
};

const methodsWithoutBodies = ['GET', 'DELETE'];

class Error extends window.Error {
    constructor(message, code) {
        super(message);

        this.code = code;
    }
}

class Response {
    static async make(response) {
        response = new this(response);

        return await response.parseJson();
    }

    constructor(response) {
        this.errorCodes = [401, 403, 404, 422, 500];
        this.raw = response;
        this.status = response.status;
    }

    async parseJson() {
        try {
            this.data = await this.raw.json();
        } catch (_) {
            // Silence
        }

        return this;
    }

    hasError() {
        return this.errorCodes.includes(this.status);
    }

    isUnauthenticated() {
        return this.status == 401;
    }
}

class Http {
    constructor({ url, method }) {
        this.url = url;

        this.request = {
            method,
            headers: {},
        };
    }

    async execute(body) {
        this.appendBody(body);

        this.response = await Response.make(await fetch(this.url, this.request));

        return this.handleError()
            .redirectIfRequired()
            .data();
    }

    data() {
        return this.response.data;
    }

    appendHeader(name, value) {
        this.request.headers[name] = value;
    }

    appendBody(body) {
        if (this.hasBody(body)) {
            this.appendHeader('Content-Type', 'application/json');

            this.request.body = JSON.stringify(body);
        }
    }

    hasBody(body) {
        return body && !methodsWithoutBodies.includes(this.method);
    }

    redirectIfRequired() {
        const { redirected, url } = this.response.raw;

        if (redirected) {
            window.location = url;
        }

        return this;
    }

    handleError() {
        if (this.response.isUnauthenticated()) {
            window.location = '/';
        } else if (this.response.hasError()) {
            throw new Error(this.response.data.message, this.response.status);
        }

        return this;
    }
}
